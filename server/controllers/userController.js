const { redirect } = require("express/lib/response");
const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

exports.view = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id: " + connection.threadId);
    connection.query("SELECT * FROM usermanagement.user", (err, rows) => {
      connection.release();
      if (!err) {
        res.render("home", { rows });
      } else {
        console.log(err);
      }
      console.log("data from user is: \n", rows);
    });
  });
};

exports.find = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id: " + connection.threadId);

    let searchInput = req.body.search;

    connection.query(
      "SELECT * FROM user WHERE last_name LIKE ? ",
      ["%" + searchInput + "%"],
      (err, rows) => {
        connection.release();
        if (!err) {
          res.render("home", { rows });
        } else {
          console.log(err);
        }
        console.log("data from user is: \n", rows);
      }
    );
  });
};

exports.create = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id: " + connection.threadId);
    const { first_name, last_name, email, phone, comments } = req.body;

    connection.query(
      "INSERT INTO `usermanagement`.`user` SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?",
      [first_name, last_name, email, phone, comments],
      (err, rows) => {
        connection.release();
        if (!err) {
          res.render("add-user", { alert: "User Added Successfully." });
        } else {
          console.log(err);
        }
        console.log("data from user is: \n", rows);
      }
    );
  });
};

exports.form = (req, res) => {
  res.render("add-user");
};

exports.edit = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id: " + connection.threadId);

    connection.query(
      "SELECT * FROM user WHERE id = ? ",
      [req.params.id],
      (err, rows) => {
        connection.release();
        if (!err) {
          res.render("edit-user", { rows });
        } else {
          console.log(err);
        }
        console.log("data from user is: \n", rows);
      }
    );
  });
};

exports.update = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id: " + connection.threadId);

    const { first_name, last_name, email, phone, comments } = req.body;

    connection.query(
      "UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?",
      [first_name, last_name, email, phone, comments, req.params.id],
      (err, rows) => {
        connection.release();
        if (!err) {
          pool.getConnection((err, connection) => {
            if (err) throw err;
            console.log("connected as id: " + connection.threadId);

            connection.query(
              "SELECT * FROM user WHERE id = ? ",
              [req.params.id],
              (err, rows) => {
                connection.release();
                if (!err) {
                  res.render("edit-user", {
                    rows,
                    alert: "User Updated Successfully.",
                  });
                } else {
                  console.log(err);
                }
                console.log("data from user is: \n", rows);
              }
            );
          });
        } else {
          console.log(err);
        }
        console.log("data from user is: \n", rows);
      }
    );
  });
};

exports.delete = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id: " + connection.threadId);

    connection.query(
      "DELETE FROM user WHERE id = ? ",
      [req.params.id],
      (err, rows) => {
        connection.release();
        if (!err) {
          //   res.render("/home", {
          //     rows,
          //     alert: "User Deleted Successfully.",
          //   });
          res.redirect("/");
        } else {
          console.log(err);
        }
        console.log("data from user is: \n", rows);
      }
    );
  });
};

exports.show = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id: " + connection.threadId);

    connection.query(
      "SELECT FROM user WHERE id = ? ",
      [req.params.id],
      (err, rows) => {
        connection.release();
        if (!err) {
          res.render("view-user", { rows });
        } else {
          console.log(err);
        }
        console.log("data from user is: \n", rows);
      }
    );
  });
};
