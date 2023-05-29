import express from "express";
import asyncHandler from "express-async-handler";
import { admin, protect } from "../middlewares/authMiddleware.js";
import Order from "../modals/orderModal.js";
import Product from "../modals/productModal.js";

const orderRoutes = express.Router();
// GET all products
orderRoutes.post(
    "/",
    protect,
    asyncHandler(async (req, res) => {
        const {
            orderItems,
            // user: req.user._id,
            shippingDetails,
            paymentDetails,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
        } = req.body;
        if (orderItems && orderItems.length === 0) {
            res.status(400);
            throw new Error("No More Orders");
            return;
        } else {
            const order = new Order({
                orderItems,
                user: req.user._id,
                shippingDetails,
                paymentDetails,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
            });

            const createOrder = await order.save();
            res.status(201).json(createOrder);
        }
    })
);
// get all products by admin

orderRoutes.get(
    "/all",
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const orders = await Order.find({})
            .sort({ _id: -1 })
            .populate("user", "id name email");

        res.json(orders);
    })
);
// get order details route

orderRoutes.get(
    "/:id",
    protect,
    asyncHandler(async (req, res) => {
        const order = await Order.findById(req.params.id).populate(
            "user",
            "name email"
        );
        if (order) {
            res.json(order);
        } else {
            res.status(400);
            throw new Error("Order Not Found");
        }
    })
);

// order paid route

orderRoutes.put(
    "/:id/pay",
    protect,
    asyncHandler(async (req, res) => {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.email_address,
            };
            const updateOrder = await order.save();
            res.json(updateOrder);
        } else {
            res.status(400);
            throw new Error("Order Not Found");
        }
    })
);
// order deliver route

orderRoutes.put(
    "/:id/delivered",
    protect,
    asyncHandler(async (req, res) => {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();

            const updateOrder = await order.save();
            res.json(updateOrder);
        } else {
            res.status(404);
            throw new Error("Order Not Found");
        }
    })
);

orderRoutes.get(
    "/",
    protect,
    asyncHandler(async (req, res) => {
        const order = await Order.find({ user: req.user._id }).sort({ _id: -1 });
        res.json(order);
    })
);

export default orderRoutes;
