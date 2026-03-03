// internal/tables/service.go
package tables

import (
	"context"
	"fmt"
	"strconv"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"api/graph/model"
)

type Service struct {
	DB *pgxpool.Pool
}

func NewService(db *pgxpool.Pool) *Service {
	return &Service{DB: db}
}

// ---------------------------------------------------------
// CREAR
// ---------------------------------------------------------
func (s *Service) Create(ctx context.Context, input model.CreateTableInput) (*model.Table, error) {
	var id int
	sql := `
		INSERT INTO tables (restaurant, "number", capacity, "status")
		VALUES ($1, $2, $3, $4)
		RETURNING id
	`

	err := s.DB.QueryRow(ctx, sql,
		input.Restaurant,
		input.Number,
		input.Capacity,
		input.Status,
	).Scan(&id)

	if err != nil {
		return nil, fmt.Errorf("error al crear la mesa: %w", err)
	}

	return &model.Table{
		ID:           fmt.Sprintf("%d", id),
		RestaurantID: input.Restaurant,
		Number:       input.Number,
		Capacity:     input.Capacity,
		Status:       input.Status,
	}, nil
}

// ---------------------------------------------------------
// OBTENER TODOS
// ---------------------------------------------------------
func (s *Service) FindAllByRestaurant(ctx context.Context, restaurant string) ([]*model.Table, error) {
	dbID, err := strconv.Atoi(restaurant)

	if err != nil {
		return nil, fmt.Errorf("el identificador del restaurante debe ser un número: %w", err)
	}

	sql := `SELECT id, restaurant, booking, "number", capacity, "status" FROM tables WHERE restaurant = $1`

	rows, err := s.DB.Query(ctx, sql, dbID)
	if err != nil {
		return nil, fmt.Errorf("error al consultar mesas: %w", err)
	}
	defer rows.Close()

	var results []*model.Table
	for rows.Next() {
		var b model.Table
		var id int
		// Escaneamos las columnas en orden
		err := rows.Scan(&id, &b.Restaurant, &b.Booking, &b.Number, &b.Capacity, &b.Status)
		if err != nil {
			return nil, err
		}
		// Convertimos el ID numérico de la DB al ID string de GraphQL
		b.ID = fmt.Sprintf("%d", id)
		results = append(results, &b)
	}
	return results, nil
}

// ---------------------------------------------------------
// OBTENER UNO EN ESPECÍFICO (GetByID)
// ---------------------------------------------------------
func (s *Service) FindOne(ctx context.Context, id string) (*model.Table, error) {
	// 1. Convertir ID de string (GraphQL) a int (Postgres)
	dbID, err := strconv.Atoi(id)
	if err != nil {
		return nil, fmt.Errorf("el ID debe ser un número: %w", err)
	}

	sql := `SELECT id, restaurant, booking, "number", capacity, "status" FROM tables WHERE id = $1`

	var b model.Table
	var idScanned int

	// 2. Ejecutar Query
	err = s.DB.QueryRow(ctx, sql, dbID).Scan(
		&idScanned,
		&b.Restaurant,
		&b.Booking,
		&b.Number,
		&b.Capacity,
		&b.Status,
	)

	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, fmt.Errorf("mesa con id %s no encontrado", id)
		}
		return nil, err
	}

	b.ID = fmt.Sprintf("%d", idScanned)
	return &b, nil
}

// ---------------------------------------------------------
// EDITAR (Update)
// ---------------------------------------------------------
func (s *Service) Update(ctx context.Context, id string, input model.UpdateTableInput) (*model.Table, error) {
	dbID, err := strconv.Atoi(id)
	if err != nil {
		return nil, fmt.Errorf("ID inválido: %w", err)
	}

	// Usamos RETURNING para obtener los datos actualizados y confirmar que se hizo
	sql := `
		UPDATE tables 
		SET restaurant = $1, booking = $2, "number" = $3, capacity = $4, "status" = $5
		WHERE id = $6
		RETURNING id, restaurant, booking, "number", capacity, "status"
	`

	var b model.Table
	var idScanned int

	// Asumiendo que el input de update tiene campos opcionales, aquí asumimos que envías todo.
	// Si son opcionales (punteros), necesitarías lógica extra para construir la query dinámicamente.
	err = s.DB.QueryRow(ctx, sql,
		input.Restaurant,
		input.Number,
		input.Capacity,
		input.Status,
		dbID, // El ID va al final por el WHERE
	).Scan(&idScanned, &b.Restaurant, &b.Booking, &b.Number, &b.Capacity, &b.Status)

	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, fmt.Errorf("no se encontró el comentario para actualizar")
		}
		return nil, fmt.Errorf("error al actualizar: %w", err)
	}

	b.ID = fmt.Sprintf("%d", idScanned)
	return &b, nil
}

// ---------------------------------------------------------
// ELIMINAR (Delete)
// ---------------------------------------------------------
func (s *Service) Delete(ctx context.Context, id string) (bool, error) {
	dbID, err := strconv.Atoi(id)
	if err != nil {
		return false, fmt.Errorf("ID inválido: %w", err)
	}

	sql := `DELETE FROM tables WHERE id = $1`

	tag, err := s.DB.Exec(ctx, sql, dbID)
	if err != nil {
		return false, fmt.Errorf("error al eliminar: %w", err)
	}

	// RowsAffected() nos dice cuántas filas se borraron.
	// Si es 0, es que el ID no existía.
	if tag.RowsAffected() == 0 {
		return false, nil // No se borró nada porque no existía
	}

	return true, nil // Se borró con éxito
}
