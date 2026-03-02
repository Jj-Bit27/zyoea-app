// internal/bookings/service.go
package bookings

import (
	"context"
	"encoding/json"
	"fmt"
	"strconv" // Necesario para convertir string ID a int ID
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"

	// Ajusta el path según tu module name (go.mod)
	"api/graph/model"
)

type Service struct {
	DB    *pgxpool.Pool
	Redis *redis.Client
}

func NewService(db *pgxpool.Pool, rdb *redis.Client) *Service {
	return &Service{DB: db, Redis: rdb}
}

// ---------------------------------------------------------
// CREAR
// ---------------------------------------------------------
func (s *Service) Create(ctx context.Context, input model.CreateBookingInput) (*model.Booking, error) {
	var id int
	sql := `
		INSERT INTO bookings (restaurant, "user", "table", people, "time", status)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id
	`

	err := s.DB.QueryRow(ctx, sql,
		input.Restaurant,
		input.User,
		input.Table,
		input.People,
		input.Time,
		input.Status,
	).Scan(&id)

	if err != nil {
		return nil, fmt.Errorf("error al crear reserva: %w", err)
	}

	return &model.Booking{
		ID:           fmt.Sprintf("%d", id),
		RestaurantID: input.Restaurant,
		UserID:       input.User,
		TableID:      input.Table,
		People:       input.People,
		Time:         input.Time,
		Status:       input.Status,
	}, nil
}

// ---------------------------------------------------------
// OBTENER TODOS
// ---------------------------------------------------------
func (s *Service) FindAllByRestaurant(ctx context.Context, restaurant string) ([]*model.Booking, error) {
	dbID, err := strconv.Atoi(restaurant)
	if err != nil {
		return nil, fmt.Errorf("el identificador del restaurante debe ser un número: %w", err)
	}

	key := fmt.Sprintf("bookings:restaurant:%d", dbID)

	val, err := s.Redis.Get(ctx, key).Result()
	if err == nil {
		// Si encontramos datos, los convertimos de JSON a Structs
		var bookings []*model.Booking
		if err := json.Unmarshal([]byte(val), &bookings); err == nil {
			fmt.Println("¡Cache Hit! Desde Redis")
			return bookings, nil
		}
	}

	sql := `
        SELECT 
            b.id, b.restaurant, b."user", b."table", b.people, b."time", b.status, 
            r.id, r.name, r.address, r.email, 
            u.id, u.name, u.email, u.role 
        FROM bookings b
        INNER JOIN restaurants r ON b.restaurant = r.id 
        INNER JOIN users u ON b."user" = u.id
        WHERE b.restaurant = $1`

	rows, err := s.DB.Query(ctx, sql, dbID)
	if err != nil {
		return nil, fmt.Errorf("error al consultar reservas: %w", err)
	}
	defer rows.Close()

	var results []*model.Booking

	for rows.Next() {
		var b model.Booking
		var r model.Restaurant
		var u model.User

		err := rows.Scan(
			&b.ID, &b.RestaurantID, &b.UserID, &b.TableID, &b.People, &b.Time, &b.Status,
			&r.ID, &r.Name, &r.Address, &r.Email,
			&u.ID, &u.Name, &u.Email, &u.Role,
		)
		if err != nil {
			return nil, err
		}

		b.Restaurant = &r
		b.User = &u

		results = append(results, &b)
	}

	data, _ := json.Marshal(results)

	s.Redis.Set(ctx, key, data, 10*time.Minute)
	return results, nil
}

// ---------------------------------------------------------
// OBTENER UNO EN ESPECÍFICO (GetByID)
// ---------------------------------------------------------
func (s *Service) FindOne(ctx context.Context, id string) (*model.Booking, error) {
	// 1. Convertir ID de string (GraphQL) a int (Postgres)
	dbID, err := strconv.Atoi(id)
	if err != nil {
		return nil, fmt.Errorf("el ID debe ser un número: %w", err)
	}

	key := fmt.Sprintf("booking:%d", dbID)

	val, err := s.Redis.Get(ctx, key).Result()
	if err == nil {
		// Si encontramos datos, los convertimos de JSON a Structs
		var booking *model.Booking
		if err := json.Unmarshal([]byte(val), &booking); err == nil {
			return booking, nil
		}
	}

	sql := `SELECT id, restaurant, "user", "table", people, "time", status FROM bookings WHERE id = $1`

	var b model.Booking
	var idScanned int

	// 2. Ejecutar Query
	err = s.DB.QueryRow(ctx, sql, dbID).Scan(
		&idScanned,
		&b.Restaurant,
		&b.User,
		&b.TableID,
		&b.People,
		&b.Time,
		&b.Status,
	)

	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, fmt.Errorf("reserva con id %s no encontrada", id)
		}
		return nil, err
	}

	b.ID = fmt.Sprintf("%d", idScanned)
	data, _ := json.Marshal(&b)

	s.Redis.Set(ctx, key, data, 10*time.Minute)
	return &b, nil
}

// ---------------------------------------------------------
// EDITAR (Update)
// ---------------------------------------------------------
// Nota: Asumo que tienes un input 'UpdateBookingInput' en tu schema.
// Si usas 'CreateBookingInput' para editar, cambia el tipo del argumento 'input'.
func (s *Service) Update(ctx context.Context, id string, input model.UpdateBookingInput) (*model.Booking, error) {
	dbID, err := strconv.Atoi(id)
	if err != nil {
		return nil, fmt.Errorf("ID inválido: %w", err)
	}

	// Usamos RETURNING para obtener los datos actualizados y confirmar que se hizo
	sql := `
		UPDATE bookings 
		SET restaurant = $1, "user" = $2, "table" = $3, people = $4, "time" = $5, status = $6
		WHERE id = $7
		RETURNING id, restaurant, "user", "table", people, "time", status
	`

	var b model.Booking
	var idScanned int

	// Asumiendo que el input de update tiene campos opcionales, aquí asumimos que envías todo.
	// Si son opcionales (punteros), necesitarías lógica extra para construir la query dinámicamente.
	err = s.DB.QueryRow(ctx, sql,
		input.Restaurant,
		input.User,
		input.Table,
		input.People,
		input.Time,
		input.Status,
		dbID, // El ID va al final por el WHERE
	).Scan(&idScanned, &b.Restaurant, &b.User, &b.TableID, &b.People, &b.Time, &b.Status)

	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, fmt.Errorf("no se encontró la reserva para actualizar")
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

	sql := `DELETE FROM bookings WHERE id = $1`

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
