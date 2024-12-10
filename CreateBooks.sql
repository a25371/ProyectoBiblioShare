CREATE TABLE Books (
    BookID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Author VARCHAR(255) NOT NULL,
    PublishedYear INT,
    ISBN VARCHAR(13) UNIQUE NOT NULL,
    PageNumber INT,
    Synopsis TEXT, 
    Cover VARCHAR(255) 
);

-- Generos de los libros
CREATE TABLE Genres (
    GenreID INT AUTO_INCREMENT PRIMARY KEY,
    GenreName VARCHAR(255) NOT NULL
);

-- Un libro puede tener varios generos
CREATE TABLE BookGenres (
    book_id INT,
    genre_id INT,
    PRIMARY KEY (book_id, genre_id),
    FOREIGN KEY (book_id) REFERENCES Books(BookID),
    FOREIGN KEY (genre_id) REFERENCES Genres(GenreID)
);

-- Series de libros
CREATE TABLE Series (
    SeriesID INT AUTO_INCREMENT PRIMARY KEY,
    SeriesName VARCHAR(255) NOT NULL
);

-- Una serie tiene varios libros
CREATE TABLE BookSeries (
    book_id INT,
    series_id INT,
    PRIMARY KEY (book_id, series_id),
    FOREIGN KEY (book_id) REFERENCES Books(BookID),
    FOREIGN KEY (series_id) REFERENCES Series(SeriesID)
);