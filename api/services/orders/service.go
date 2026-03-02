package orders

import (
	"context"
	"errors"
	"fmt"
	"time"

	"api/graph/model"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Service struct {
	DB *pgxpool.Pool
}

func NewService(db *pgxpool.Pool) *Service {
	return &Service{DB: db}
}

// ---------------------------------------------------------
// 1. FIND BY RESTAURANT
// ---------------------------------------------------------
func (s *Service) FindAllByRestaurant(ctx context.Context, restaurantID string) ([]*model.Order, error) {
	// Solo traemos la tabla 'pedidos'. Los detalles se resuelven en el Resolver.
	sql := `
		SELECT id, user, user_name, restaurant, status, type, total, notes, table, date
		FROM orders
		WHERE restaurant = $1
	`
	rows, err := s.DB.Query(ctx, sql, restaurantID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var orders []*model.Order
	for rows.Next() {
		var o model.Order
		// Notas y mesa_id pueden ser nulos en DB
		var notes *string
		var mesaId *int

		err := rows.Scan(
			&o.ID, &o.UserID, &o.UserName, &o.RestaurantID, &o.Status,
			&o.Type, &o.Total, &notes, &mesaId, &o.Date,
		)
		if err != nil {
			return nil, err
		}
		o.Notes = notes
		o.TableID = mesaId
		orders = append(orders, &o)
	}
	return orders, nil
}

// ---------------------------------------------------------
// 2. FIND ONE
// ---------------------------------------------------------
func (s *Service) FindOne(ctx context.Context, id string) (*model.Order, error) {
	var o model.Order
	var notes *string
	var mesaId *int

	sql := `
		SELECT id, user, user_name, restaurant, status, type, total, notes, table, date
		FROM orders WHERE id = $1
	`
	err := s.DB.QueryRow(ctx, sql, id).Scan(
		&o.ID, &o.UserID, &o.UserName, &o.RestaurantID, &o.Status,
		&o.Type, &o.Total, &notes, &mesaId, &o.Date,
	)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, errors.New("pedido no encontrado")
		}
		return nil, err
	}
	o.Notes = notes
	o.TableID = mesaId
	return &o, nil
}

// ---------------------------------------------------------
// 3. CREATE (Transacción Maestra)
// ---------------------------------------------------------
func (s *Service) Create(ctx context.Context, input model.CreateOrderInput) (*model.Order, error) {
	// A. Iniciar Transacción
	tx, err := s.DB.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	// B. Insertar Pedido (Cabecera)
	var newOrder model.Order
	sqlOrder := `
		INSERT INTO orders (user, user_name, restaurant, status, type, total, notes, table, date)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING id, user, user_name, restaurant, status, type, total, notes, table, date
	`
	// Usamos fecha actual
	fecha := time.Now()

	err = tx.QueryRow(ctx, sqlOrder,
		input.User, input.UserName, input.Restaurant, input.Status, input.Type, input.Total, input.Notes, input.Table, fecha,
	).Scan(
		&newOrder.ID, &newOrder.UserID, &newOrder.UserName, &newOrder.RestaurantID,
		&newOrder.Status, &newOrder.Type, &newOrder.Total, &newOrder.Notes, &newOrder.TableID, &newOrder.Date,
	)

	if err != nil {
		return nil, fmt.Errorf("error creando cabecera de pedido: %w", err)
	}

	// C. Insertar Detalles (Items) - Loop dentro de la transacción
	sqlDetail := `
		INSERT INTO order_details (order_id, product_id, quantity, subtotal)
		VALUES ($1, $2, $3, $4)
	`
	for _, item := range input.Items {
		_, err := tx.Exec(ctx, sqlDetail, newOrder.ID, item.ProductID, item.Quantity, item.Subtotal)
		if err != nil {
			return nil, fmt.Errorf("error insertando detalle de producto %d: %w", item.ProductID, err)
		}
	}

	// D. Commit
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}

	return &newOrder, nil
}

// ---------------------------------------------------------
// 4. UPDATE (Solo Estado)
// ---------------------------------------------------------
func (s *Service) Update(ctx context.Context, input model.UpdateOrderInput) (*model.Order, error) {
	// En tu código NestJS solo actualizas el estado
	if input.Estado == nil {
		return nil, errors.New("el estado es obligatorio para actualizar")
	}

	sql := `UPDATE orders SET status = $1 WHERE id = $2`
	tag, err := s.DB.Exec(ctx, sql, *input.Estado, input.ID)
	if err != nil {
		return nil, err
	}
	if tag.RowsAffected() == 0 {
		return nil, errors.New("pedido no encontrado")
	}

	// Retornamos el objeto actualizado buscándolo de nuevo
	return s.FindOne(ctx, input.ID)
}

// ---------------------------------------------------------
// 5. REMOVE (Transacción Manual)
// ---------------------------------------------------------
func (s *Service) Delete(ctx context.Context, id string) (bool, error) {
	tx, err := s.DB.Begin(ctx)
	if err != nil {
		return false, err
	}
	defer tx.Rollback(ctx)

	// A. Borrar Detalles primero
	_, err = tx.Exec(ctx, "DELETE FROM order_details WHERE order_id = $1", id)
	if err != nil {
		return false, err
	}

	// B. Borrar Pedido
	tag, err := tx.Exec(ctx, "DELETE FROM orders WHERE id = $1", id)
	if err != nil {
		return false, err
	}

	if tag.RowsAffected() == 0 {
		return false, errors.New("pedido no encontrado")
	}

	if err := tx.Commit(ctx); err != nil {
		return false, err
	}
	return true, nil
}

// ---------------------------------------------------------
// HELPER: GetDetails (Para el Resolver)
// ---------------------------------------------------------
func (s *Service) GetDetailsByOrderID(ctx context.Context, orderID int) ([]*model.OrderDetail, error) {
	sql := `SELECT id, order_id, product_id, quantity, subtotal FROM order_details WHERE order_id = $1`

	rows, err := s.DB.Query(ctx, sql, orderID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var details []*model.OrderDetail
	for rows.Next() {
		var d model.OrderDetail
		rows.Scan(&d.ID, &d.Order, &d.ProductID, &d.Quantity, &d.Subtotal)
		details = append(details, &d)
	}
	return details, nil
}
