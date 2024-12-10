-- Crea la tabla de usuarios
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    pronouns VARCHAR(50)
);

-- Tabla para almacenar los usuarios que sigue un usuario
CREATE TABLE watched_users (
    user_id INT,
    watched_user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (watched_user_id) REFERENCES users(id)
);

-- Custom_lists guarda las listas personalizadas de los usuarios
CREATE TABLE custom_lists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabla para almacenar los libros de las listas personalizadas
CREATE TABLE list_books (
    list_id INT,
    book_id INT,
    PRIMARY KEY (list_id, book_id),
    FOREIGN KEY (list_id) REFERENCES custom_lists(id),
    FOREIGN KEY (book_id) REFERENCES Books(BookID)
);

-- Crea la tabla de reviews
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    book_id INT,
    rating INT,
    review TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES Books(BookID)
);

-- Crear la tabla de status
CREATE TABLE statuses (
    user_id INT,
    book_id INT,
    status ENUM('Dropped', 'Reading', 'Waiting', 'Finished'),
    PRIMARY KEY (user_id, book_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES Books(BookID)
);

