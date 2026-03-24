import mysql from 'mysql2/promise';

export default async function handler(req, res) {

  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'POST')
    return res.status(405).end();

  try {

    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    const d = req.body;

    // INWARD
    if (d.table === "inward") {

      await conn.execute(
        "INSERT INTO inward (sno, seller_name, category, sub_category, qty) VALUES (?,?,?,?,?)",
        [d.sno, d.seller_name, d.category, d.sub_category, d.qty]
      );

    }

    // OUTWARD
    if (d.table === "outward") {

      await conn.execute(
        "INSERT INTO outward (order_date, customer_name, category, sub_category, qty, rate, net_amount, requirements, note) VALUES (?,?,?,?,?,?,?,?,?)",
        [
          d.order_date,
          d.customer_name,
          d.category,
          d.sub_category,
          d.qty,
          d.rate,
          d.net_amount,
          d.requirements,
          d.note
        ]
      );

    }

    await conn.end();

    res.status(200).json({ success: true });

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

}
