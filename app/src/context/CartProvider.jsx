import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CartContext } from "./CartContext";
import PropTypes from "prop-types";

/**
 * Lee el carrito guardado en localStorage.
 * Si no existe o hay error, devuelve [].
 */
function loadCartFromStorage() {
    const storedCart = localStorage.getItem("cart");

    if (!storedCart) return [];

    try {
        return JSON.parse(storedCart);
    } catch (error) {
        console.error("Error al leer el carrito:", error);
        return [];
    }
}

export function CartProvider({ children }) {
    const [cart, setCart] = useState(loadCartFromStorage);

    /**
     * Guardar carrito en localStorage cada vez que cambie
     */
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    /**
     * Agregar una película al carrito
     * Si ya existe, aumenta los días en 1
     */
    const addItem = (movie) => {
        const existingItem = cart.find((item) => item.id === movie.id);

        if (existingItem) {
            const updatedCart = cart.map((item) =>
                item.id === movie.id
                    ? { ...item, days: item.days + 1 }
                    : item
            );

            setCart(updatedCart);
            toast(`Se aumentó un día para "${movie.title}"`);
            return;
        }

        const newItem = {
            ...movie,
            price: Number(movie.price),
            days: 1,
        };

        setCart([...cart, newItem]);
        toast.success(`"${movie.title}" agregado al carrito`);
    };

    /**
     * Eliminar una película
     */
    const removeItem = (id) => {
        const movie = cart.find((item) => item.id === id);

        const updatedCart = cart.filter((item) => item.id !== id);
        setCart(updatedCart);

        if (movie) {
            toast.error(`"${movie.title}" eliminado del carrito`);
        }
    };

    /**
     * Cambiar cantidad de días
     */
    const updateDays = (id, days) => {
        const numericDays = Number(days);

        if (isNaN(numericDays) || numericDays < 1) {
            toast.error("Los días deben ser mayores o iguales a 1");
            return;
        }

        const updatedCart = cart.map((item) =>
            item.id === id
                ? { ...item, days: numericDays }
                : item
        );

        setCart(updatedCart);
        toast.success("Cantidad de días actualizada");
    };

    /**
     * Vaciar carrito
     */
    const clearCart = () => {
        setCart([]);
        toast("Carrito vaciado");
    };

    /**
     * Valores derivados
     */
    const totalItems = cart.length;

    const totalPrice = cart.reduce(
        (acc, item) => acc + Number(item.price) * Number(item.days),
        0
    );

    const value = {
        cart,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        updateDays,
        clearCart,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

CartProvider.propTypes = {
    children: PropTypes.node.isRequired,
};