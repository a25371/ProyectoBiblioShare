const express = require("express");
const mysql = require("mysql2");
const app = express();

app.use(express.json());

// Create a connection to the database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "biblioshare",
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database.");
});

// Start the server
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

// User login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const query = "SELECT id FROM users WHERE username = ? AND password = ?";
  connection.query(query, [username, password], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (results.length > 0) {
      const userId = results[0].id;
      res.json({ success: true, userId });
    } else {
      res.json({ success: false });
    }
  });
});

// Search users by name
app.get('/search_users', (req, res) => {
  const { query } = req.query;
  const sqlQuery = 'SELECT id, username FROM users WHERE username LIKE ?';
  connection.query(sqlQuery, [`%${query}%`], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// ------------------------------------------------------
//  Profile
// ------------------------------------------------------

// Get user profile by user ID
app.get('/user_profile', (req, res) => {
  const { userId } = req.query;
  const query = 'SELECT username, pronouns FROM users WHERE id = ?';
  connection.query(query, [userId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results[0] || {});
  });
});

// Update user profile
app.put("/profile", (req, res) => {
  const { currentUsername, username, pronouns, password } = req.body;

  let query = "UPDATE users SET";
  const queryParams = [];
  if (username) {
    query += " username = ?,";
    queryParams.push(username);
  }
  if (pronouns) {
    query += " pronouns = ?,";
    queryParams.push(pronouns);
  }
  if (password) {
    query += " password = ?,";
    queryParams.push(password);
  }
  // Remove the trailing comma!! and add the WHERE clause
  query = query.slice(0, -1) + " WHERE username = ?";
  queryParams.push(currentUsername);

  connection.query(query, queryParams, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true });
  });
});

// ------------------------------------------------------
//  User
// ------------------------------------------------------

// Create a new user
app.post("/users", (req, res) => {
  const { username, password, pronouns } = req.body;
  const query =
    "INSERT INTO users (username, password, pronouns) VALUES (?, ?, ?)";
  connection.query(query, [username, password, pronouns], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: results.insertId, username, password, pronouns });
  });
});

// ------------------------------------------------------
//  Books
// ------------------------------------------------------

// Get books based on search criteria
app.get("/books", (req, res) => {
  const { query, searchBy } = req.query;
  let sqlQuery = "SELECT * FROM books";
  let queryParams = [];

  if (query) {
    switch (searchBy) {
      case 'Title':
        sqlQuery += " WHERE title LIKE ?";
        queryParams.push(`%${query}%`);
        break;
      case 'Author':
        sqlQuery += " WHERE author LIKE ?";
        queryParams.push(`%${query}%`);
        break;
      case 'Release Year':
        sqlQuery += " WHERE publishedyear = ?";
        queryParams.push(query);
        break;
      case 'Genre':
        sqlQuery = `
          SELECT books.*
          FROM books
          JOIN bookgenres ON books.BookID = bookgenres.book_id
          JOIN genres ON bookgenres.genre_id = genres.GenreID
          WHERE genres.GenreName LIKE ?
        `;
        queryParams.push(`%${query}%`);
        break;
      default:
        break;
    }
  }

  connection.query(sqlQuery, queryParams, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// Get book details by ID
app.get("/books/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM books WHERE BookID = ?";
  connection.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results[0]);
  });
});

// Get books by reading status
app.get("/books_by_reading_status", (req, res) => {
  const { userId, status } = req.query;
  const query = `
    SELECT Books.*
    FROM Books
    JOIN statuses ON Books.BookID = statuses.book_id
    WHERE statuses.user_id = ? AND statuses.status = ?
  `;
  connection.query(query, [userId, status], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// ------------------------------------------------------
//  Social
// ------------------------------------------------------

// Get watched users for a user
app.get("/watched_users", (req, res) => {
  const { userId } = req.query;
  const query = `
    SELECT users.id, users.username
    FROM watched_users
    JOIN users ON watched_users.watched_user_id = users.id
    WHERE watched_users.user_id = ?
  `;
  connection.query(query, [userId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// Get user watch status
app.get('/user_watch_status', (req, res) => {
  const { currentUserId, userId } = req.query;
  const query = 'SELECT COUNT(*) AS isWatched FROM watched_users WHERE user_id = ? AND watched_user_id = ?';
  connection.query(query, [currentUserId, userId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ isWatched: results[0].isWatched > 0 });
  });
});

// Update user watch status
app.post('/update_watch_status', (req, res) => {
  const { currentUserId, userId, isWatched } = req.body;
  let query;
  if (isWatched) {
    query = 'INSERT INTO watched_users (user_id, watched_user_id) VALUES (?, ?)';
  } else {
    query = 'DELETE FROM watched_users WHERE user_id = ? AND watched_user_id = ?';
  }
  connection.query(query, [currentUserId, userId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true });
  });
});

// Get book clubs for a user
app.get("/book_clubs", (req, res) => {
  const { userId } = req.query;
  const query = `
    SELECT book_clubs.id, book_clubs.name
    FROM user_book_clubs
    JOIN book_clubs ON user_book_clubs.book_club_id = book_clubs.id
    WHERE user_book_clubs.user_id = ?
  `;
  connection.query(query, [userId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// ------------------------------------------------------
//  Custom_lists (connects users with custom lists)
// ------------------------------------------------------

// Get custom lists for a user with book count
app.get("/custom_lists", (req, res) => {
  const { userId } = req.query;
  const query = `
      SELECT custom_lists.*, COUNT(list_books.book_id) AS bookCount
      FROM custom_lists
      LEFT JOIN list_books ON custom_lists.id = list_books.list_id
      WHERE custom_lists.user_id = ?
      GROUP BY custom_lists.id
    `;
  connection.query(query, [userId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// Get list details
app.get('/list_details', (req, res) => {
  const { listId } = req.query;
  const query = 'SELECT name FROM custom_lists WHERE id = ?';
  connection.query(query, [listId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results[0]);
  });
});

// Create a new custom list
app.post("/custom_lists", (req, res) => {
  const { userId, name } = req.body;
  const query = "INSERT INTO custom_lists (user_id, name) VALUES (?, ?)";
  connection.query(query, [userId, name], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: results.insertId, userId, name });
  });
});

// Update a custom book list
app.put("/custom_lists", (req, res) => {
  const { id, name } = req.body;
  const query = "UPDATE custom_lists SET name = ? WHERE id = ?";
  connection.query(query, [name, id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id, name });
  });
});

// Delete custom list
app.delete('/delete_custom_list', (req, res) => {
  const { listId } = req.body;
  const deleteListBooksQuery = 'DELETE FROM list_books WHERE list_id = ?';
  const deleteCustomListQuery = 'DELETE FROM custom_lists WHERE id = ?';

  connection.beginTransaction((err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    connection.query(deleteListBooksQuery, [listId], (err, results) => {
      if (err) {
        return connection.rollback(() => {
          res.status(500).json({ error: err.message });
        });
      }

      connection.query(deleteCustomListQuery, [listId], (err, results) => {
        if (err) {
          return connection.rollback(() => {
            res.status(500).json({ error: err.message });
          });
        }

        connection.commit((err) => {
          if (err) {
            return connection.rollback(() => {
              res.status(500).json({ error: err.message });
            });
          }
          res.json({ success: true });
        });
      });
    });
  });
});

// ------------------------------------------------------
//  List_books (connects books with custom lists)
// ------------------------------------------------------

// Get books in a custom list
app.get("/list_books", (req, res) => {
  const { listId } = req.query;
  const query = `
      SELECT books.*
      FROM list_books
      JOIN books ON list_books.book_id = books.bookID
      WHERE list_books.list_id = ?
    `;
  connection.query(query, [listId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// Add a book to a custom list
app.post("/list_books", (req, res) => {
  const { list_id, book_id } = req.body;
  const query = "INSERT INTO list_books (list_id, book_id) VALUES (?, ?)";
  connection.query(query, [list_id, book_id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ list_id, book_id });
  });
});

// Remove a book from a custom list
app.delete("/list_books", (req, res) => {
  const { list_id, book_id } = req.body;
  const query = "DELETE FROM list_books WHERE list_id = ? AND book_id = ?";
  connection.query(query, [list_id, book_id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: "Book removed from custom list" });
  });
});

// ------------------------------------------------------
//  Reviews
// ------------------------------------------------------

// Save a review
app.post("/save_review", (req, res) => {
  const { userId, bookId, rating, review } = req.body;
  const query =
    "INSERT INTO Reviews (user_id, book_id, rating, review) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE rating = VALUES(rating), review = VALUES(review)";
  connection.query(query, [userId, bookId, rating, review], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true });
  });
});

// Delete a review for a book
app.delete("/reviews", (req, res) => {
  const { id } = req.body;
  const query = "DELETE FROM reviews WHERE id = ?";
  connection.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: "Review deleted" });
  });
});

// Get user's review and rating for a book
app.get("/user_review", (req, res) => {
  const { userId, bookId } = req.query;
  const query =
    "SELECT rating, review FROM Reviews WHERE user_id = ? AND book_id = ?";
  connection.query(query, [userId, bookId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results[0] || {});
  });
});

// Get book names and review data based on user ID
app.get("/user_reviewsAndBooks", (req, res) => {
  const { userId } = req.query;
  const query = `
    SELECT Books.Title AS bookName, Reviews.rating, Reviews.review
    FROM Reviews
    JOIN Books ON Reviews.book_id = Books.BookID
    WHERE Reviews.user_id = ?
  `;
  connection.query(query, [userId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// ------------------------------------------------------
//  Progress
// ------------------------------------------------------

// Track progress on a book
app.post("/progress", (req, res) => {
  const { user_id, book_id, percentage } = req.body;
  const query =
    "INSERT INTO progress (user_id, book_id, percentage) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE percentage = VALUES(percentage)";
  connection.query(query, [user_id, book_id, percentage], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ user_id, book_id, percentage });
  });
});

// Update progress on a book
app.put("/progress", (req, res) => {
  const { user_id, book_id, percentage } = req.body;
  const query =
    "UPDATE progress SET percentage = ? WHERE user_id = ? AND book_id = ?";
  connection.query(query, [percentage, user_id, book_id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ user_id, book_id, percentage });
  });
});

// Delete progress on a book
app.delete("/progress", (req, res) => {
  const { user_id, book_id } = req.body;
  const query = "DELETE FROM progress WHERE user_id = ? AND book_id = ?";
  connection.query(query, [user_id, book_id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: "Progress deleted" });
  });
});

// ------------------------------------------------------
//  Statuses
// ------------------------------------------------------

// Get user's reading status for a book
app.get("/user_reading_status", (req, res) => {
  const { userId, bookId } = req.query;
  const query = "SELECT status FROM statuses WHERE user_id = ? AND book_id = ?";
  connection.query(query, [userId, bookId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results[0] || {});
  });
});

// Update user's reading status for a book
app.post("/update_reading_status", (req, res) => {
  const { userId, bookId, status } = req.body;
  const query =
    "INSERT INTO statuses (user_id, book_id, status) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE status = VALUES(status)";
  connection.query(query, [userId, bookId, status], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true });
  });
});

// Delete book status
app.delete("/statuses", (req, res) => {
  const { user_id, book_id } = req.body;
  const query = "DELETE FROM statuses WHERE user_id = ? AND book_id = ?";
  connection.query(query, [user_id, book_id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: "Status deleted" });
  });
});
