// internal/categories/service.go
package categories

import (
	"context"
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"

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
func (s *Service) Create(ctx context.Context, input model.CreateCategoryInput) (*model.Category, error) {
	var id int
	sql := `
		INSERT INTO categories (restaurant, "name")
		VALUES ($1, $2)
		RETURNING id
	`

	err := s.DB.QueryRow(ctx, sql,
		input.Restaurant,
		input.Name,
	).Scan(&id)

	if err != nil {
		return nil, fmt.Errorf("error al crear la categoría: %w", err)
	}

	return &model.Category{
		ID:           fmt.Sprintf("%d", id),
		RestaurantID: input.Restaurant,
		Name:         input.Name,
	}, nil
}

// ---------------------------------------------------------
// OBTENER TODOS
// ---------------------------------------------------------
func (s *Service) FindAllByRestaurant(ctx context.Context, restaurant string) ([]*model.Category, error) {
	dbID, err := strconv.Atoi(restaurant)

	if err != nil {
		return nil, fmt.Errorf("el identificador del restaurante debe ser un número: %w", err)
	}

	key := fmt.Sprintf("categories:restaurant:%d", dbID)

	val, err := s.Redis.Get(ctx, key).Result()
	if err == nil {
		// Si encontramos datos, los convertimos de JSON a Structs
		var categories []*model.Category
		if err := json.Unmarshal([]byte(val), &categories); err == nil {
			fmt.Println("¡Cache Hit! Desde Redis")
			return categories, nil
		}
	}

	println(err)

	sql := `SELECT 
		c.id, c."name",
		r.id, r."name"
	FROM categories c 
	INNER JOIN restaurants r ON c.restaurant = r.id
	WHERE c.restaurant = $1`

	rows, err := s.DB.Query(ctx, sql, dbID)
	if err != nil {
		return nil, fmt.Errorf("error al consultar categorías: %w", err)
	}
	defer rows.Close()

	var results []*model.Category
	for rows.Next() {
		var b model.Category
		var id int
		var r model.Restaurant
		// Escaneamos las columnas en orden
		err := rows.Scan(&id, &b.Name, &r.ID, &r.Name)
		if err != nil {
			return nil, err
		}
		b.Restaurant = &r
		// Convertimos el ID numérico de la DB al ID string de GraphQL
		b.ID = fmt.Sprintf("%d", id)
		results = append(results, &b)
	}

	data, _ := json.Marshal(results)

	s.Redis.Set(ctx, key, data, 10*time.Minute)
	return results, nil
}

// ---------------------------------------------------------
// OBTENER UNO EN ESPECÍFICO (GetByID)
// ---------------------------------------------------------
func (s *Service) FindOne(ctx context.Context, id string) (*model.Category, error) {
	// 1. Convertir ID de string (GraphQL) a int (Postgres)
	dbID, err := strconv.Atoi(id)
	if err != nil {
		return nil, fmt.Errorf("el ID debe ser un número: %w", err)
	}

	sql := `SELECT id, restaurant, "name" FROM categories WHERE id = $1`

	var b model.Category
	var idScanned int

	// 2. Ejecutar Query
	err = s.DB.QueryRow(ctx, sql, dbID).Scan(
		&idScanned,
		&b.Restaurant,
		&b.Name,
	)

	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, fmt.Errorf("categoría con id %s no encontrado", id)
		}
		return nil, err
	}

	b.ID = fmt.Sprintf("%d", idScanned)
	return &b, nil
}

// ---------------------------------------------------------
// EDITAR (Update)
// ---------------------------------------------------------
func (s *Service) Update(ctx context.Context, id string, input model.UpdateCategoryInput) (*model.Category, error) {
	dbID, err := strconv.Atoi(id)
	if err != nil {
		return nil, fmt.Errorf("ID inválido: %w", err)
	}

	// Usamos RETURNING para obtener los datos actualizados y confirmar que se hizo
	sql := `
		UPDATE categories 
		SET restaurant = $1, "name" = $2
		WHERE id = $3
		RETURNING id, restaurant, "name"
	`
	var b model.Category
	var idScanned int

	// Asumiendo que el input de update tiene campos opcionales, aquí asumimos que envías todo.
	// Si son opcionales (punteros), necesitarías lógica extra para construir la query dinámicamente.
	err = s.DB.QueryRow(ctx, sql,
		input.Restaurant,
		input.Name,
		dbID, // El ID va al final por el WHERE
	).Scan(&idScanned, &b.Restaurant, &b.Name)

	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, fmt.Errorf("no se encontró la categoría para actualizar")
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

	sql := `DELETE FROM categories WHERE id = $1`

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
