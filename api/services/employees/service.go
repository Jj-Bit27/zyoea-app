package employees

import (
	"context"
	"errors"
	"fmt"
	"time"

	"api/graph/model"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/bcrypt"
)

type Service struct {
	DB *pgxpool.Pool
}

func NewService(db *pgxpool.Pool) *Service {
	return &Service{DB: db}
}

// ---------------------------------------------------------
// 1. FIND ALL BY RESTAURANT
// ---------------------------------------------------------
func (s *Service) FindAllByRestaurant(ctx context.Context, restaurantID string) ([]*model.Employee, error) {
	// Consulta directa a la base de datos
	sql := `
		SELECT id, restaurant, user, position, hire_date
		FROM employees
		WHERE restaurant = $1
	`
	rows, err := s.DB.Query(ctx, sql, restaurantID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var employees []*model.Employee
	for rows.Next() {
		var e model.Employee
		if err := rows.Scan(&e.ID, &e.RestaurantID, &e.User.ID, &e.Position, &e.HireDate); err != nil {
			return nil, err
		}
		employees = append(employees, &e)
	}

	return employees, nil
}

// ---------------------------------------------------------
// 2. CREATE (Transacción: Usuario + Empleado)
// ---------------------------------------------------------
func (s *Service) Create(ctx context.Context, input model.CreateEmployeeInput) (*model.Employee, error) {
	// A. Hashear Password
	hashedPwd, err := bcrypt.GenerateFromPassword([]byte(input.Password), 10)
	if err != nil {
		return nil, err
	}

	// B. Iniciar Transacción SQL
	tx, err := s.DB.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx) // Seguridad: Si algo falla, deshacer todo

	// C. Crear Usuario
	var userID int
	sqlUser := `
		INSERT INTO users (name, email, password, role, is_verified)
		VALUES ($1, $2, $3, $4, true)
		RETURNING id
	`
	// Usamos input.Puesto como Rol inicial
	err = tx.QueryRow(ctx, sqlUser, input.Name, input.Email, string(hashedPwd), input.Position).Scan(&userID)
	if err != nil {
		return nil, fmt.Errorf("error creando usuario: %w", err)
	}

	// D. Crear Empleado
	var emp model.Employee
	sqlEmp := `
		INSERT INTO employees (user, restaurant, position, hire_date)
		VALUES ($1, $2, $3, $4)
		RETURNING id, restaurant, user, position, hire_date
	`
	// Usamos time.Now() para la fecha de contratación
	err = tx.QueryRow(ctx, sqlEmp, userID, input.RestaurantID, input.Position, time.Now()).Scan(
		&emp.ID, &emp.RestaurantID, &emp.User.ID, &emp.Position, &emp.HireDate,
	)
	if err != nil {
		return nil, fmt.Errorf("error creando empleado: %w", err)
	}

	// E. Commit Transacción (Guardar cambios permanentemente)
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}

	return &emp, nil
}

// ---------------------------------------------------------
// 3. UPDATE (Transacción)
// ---------------------------------------------------------
func (s *Service) Update(ctx context.Context, input model.UpdateEmployeeInput) (*model.Employee, error) {
	// Primero buscamos el empleado para obtener su usuario_id
	var currentEmp model.Employee
	err := s.DB.QueryRow(ctx, "SELECT restaurant, user FROM employees WHERE id=$1", input.ID).Scan(
		&currentEmp.RestaurantID, &currentEmp.User.ID,
	)
	if err == pgx.ErrNoRows {
		return nil, errors.New("empleado no encontrado")
	}

	tx, err := s.DB.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	// A. Actualizar Usuario (Si enviaron datos de usuario)
	if input.Name != nil || input.Email != nil {
		sqlUser := `
            UPDATE users SET 
                name = COALESCE($1, name),
                email = COALESCE($2, email)
            WHERE id = $3
        `
		_, err = tx.Exec(ctx, sqlUser, input.Name, input.Email, currentEmp.User.ID)
		if err != nil {
			return nil, fmt.Errorf("error actualizando usuario: %w", err)
		}
	}

	// B. Actualizar Empleado (Si enviaron datos de empleado)
	if input.RestaurantID != nil || input.Position != nil {
		sqlEmp := `
            UPDATE employees SET
                restaurant = COALESCE($1, restaurant),
                position = COALESCE($2, position)
            WHERE id = $3
        `
		_, err = tx.Exec(ctx, sqlEmp, input.RestaurantID, input.Position, input.ID)
		if err != nil {
			return nil, fmt.Errorf("error actualizando empleado: %w", err)
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}

	// Retornamos el empleado actualizado
	return s.FindOne(ctx, input.ID)
}

// ---------------------------------------------------------
// 4. REMOVE (Transacción: Borrar Empleado -> Borrar Usuario)
// ---------------------------------------------------------
func (s *Service) Delete(ctx context.Context, id string) (bool, error) {
	var userID int
	err := s.DB.QueryRow(ctx, "SELECT user FROM employees WHERE id=$1", id).Scan(&userID)
	if err != nil {
		return false, errors.New("empleado no encontrado")
	}

	tx, err := s.DB.Begin(ctx)
	if err != nil {
		return false, err
	}
	defer tx.Rollback(ctx)

	// A. Borrar Empleado
	if _, err := tx.Exec(ctx, "DELETE FROM employees WHERE id=$1", id); err != nil {
		return false, err
	}

	// B. Borrar Usuario
	if _, err := tx.Exec(ctx, "DELETE FROM users WHERE id=$1", userID); err != nil {
		return false, err
	}

	if err := tx.Commit(ctx); err != nil {
		return false, err
	}

	return true, nil
}

// ---------------------------------------------------------
// HELPER: FIND ONE
// ---------------------------------------------------------
func (s *Service) FindOne(ctx context.Context, id string) (*model.Employee, error) {
	var e model.Employee
	sql := `SELECT id, restaurant, user, position, hire_date FROM employees WHERE id = $1`
	err := s.DB.QueryRow(ctx, sql, id).Scan(&e.ID, &e.RestaurantID, &e.User.ID, &e.Position, &e.HireDate)
	if err != nil {
		return nil, err
	}
	return &e, nil
}
