import { db } from "../db.js"

export const getHomes = (req, res) => {
    const q = "SELECT * FROM dkhomes.homes";
    db.query(q, [], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
};

export const getSingleHome = (req, res) => {
    const q = "SELECT * FROM dkhomes.homes where id = ?";
    db.query(q, [req.body.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
};

export const makeHomeSold = (req, res) => {
    const q = "UPDATE dkhomes.homes SET owned = 'TRUE' WHERE id = ?";
    db.query(q, [req.body.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
};

export const updateOwner = (req, res) => {
    const q = "UPDATE dkhomes.homes SET ownerWallet = ? WHERE id = ?";
    db.query(q, [req.body.owner, req.body.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
};

export const getUsersHomes = (req, res) => {
    const q = "SELECT * FROM dkhomes.homes where ownerWallet = ?";
    db.query(q, [req.body.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
};