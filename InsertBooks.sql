-- Insert books
INSERT INTO Books (BookID, Title, Author, PublishedYear, ISBN, PageNumber, Synopsis, Cover)
VALUES 
(1, "To Kill a Mockingbird", "Harper Lee", 1960, "9780061120084", 281, "A novel about the serious issues of rape and racial inequality.", "https://res.cloudinary.com/dtjdlphzv/image/upload/v1733407881/drdviwxphpbm1zpweyej.jpg"),
(2, "1984", "George Orwell", 1949, "9780452284234", 328, "A dystopian novel set in a totalitarian society under constant surveillance.", "https://res.cloudinary.com/dtjdlphzv/image/upload/v1733409899/udquonjaiojzofq5tkln.jpg"),
(3, "Pride and Prejudice", "Jane Austen", 1813, "9780199535569", 279, "A romantic novel that also critiques the British landed gentry at the end of the 18th century.", "https://res.cloudinary.com/dtjdlphzv/image/upload/v1733409895/pcnymtncibbuygjyqsda.jpg"),
(4, "The Great Gatsby", "F. Scott Fitzgerald", 1925, "9780743273565", 180, "A novel about the American dream and the roaring twenties.", "https://res.cloudinary.com/dtjdlphzv/image/upload/v1733409896/xyzwjsuvw7v8j7itvcbi.jpg"),
(5, "Moby-Dick", "Herman Melville", 1851, "9780142437247", 635, "A novel about the voyage of the whaling ship Pequod.", "https://res.cloudinary.com/dtjdlphzv/image/upload/v1733409895/hi5gjcpsvirimypt30dk.jpg"),
(6, "The Catcher in the Rye", "J.D. Salinger", 1951, "9780316769480", 277, "A novel about teenage rebellion and angst.", "https://res.cloudinary.com/dtjdlphzv/image/upload/v1733409896/c91cg5btzaztxt8nw4xs.jpg"),
(7, "The Hobbit", "J.R.R. Tolkien", 1937, "9780618002213", 310, "A fantasy novel about the journey of Bilbo Baggins.", "https://res.cloudinary.com/dtjdlphzv/image/upload/v1733409895/fnz7nsgq7wdgrclikciv.jpg"),
(8, "Harry Potter and the Sorcerers Stone", "J.K. Rowling", 1997, "9780590353403", 309, "The first book in the Harry Potter series, introducing Harry and his first year at Hogwarts.", "https://res.cloudinary.com/dtjdlphzv/image/upload/v1733409895/vcisj8b7vfio5se7orx7.jpg"),
(9, "Harry Potter and the Chamber of Secrets", "J.K. Rowling", 1998, "9780439064866", 341, "The second book in the Harry Potter series, where Harry returns to Hogwarts and faces new challenges.", "https://res.cloudinary.com/dtjdlphzv/image/upload/v1733409898/g8lbou6mqtjthgwyca7l.jpg"),
(10, "Harry Potter and the Prisoner of Azkaban", "J.K. Rowling", 1999, "9780439136358", 435, "The third book in the Harry Potter series, where Harry learns about Sirius Black.", "https://res.cloudinary.com/dtjdlphzv/image/upload/v1733409898/isynullk6dbxu0qjah92.jpg"),
(11, "Harry Potter and the Goblet of Fire", "J.K. Rowling", 2000, "9780439139595", 734, "The fourth book in the Harry Potter series, featuring the Triwizard Tournament.", "https://res.cloudinary.com/dtjdlphzv/image/upload/v1733409899/dtqhzamhmanjhwhtztq5.jpg"),
(12, "Harry Potter and the Order of the Phoenix", "J.K. Rowling", 2003, "9780439358064", 870, "The fifth book in the Harry Potter series, where Harry faces new threats from Voldemort.", "https://res.cloudinary.com/dtjdlphzv/image/upload/v1733409899/dzoxbo5se1t9a4dvagsk.jpg"),
(13, "Harry Potter and the Half-Blood Prince", "J.K. Rowling", 2005, "9780439784542", 652, "The sixth book in the Harry Potter series, where Harry learns more about Voldemort\'s past.", "https://res.cloudinary.com/dtjdlphzv/image/upload/v1733409899/nvfi63wqokfojkeaglc2.jpg"),
(14, "Harry Potter and the Deathly Hallows", "J.K. Rowling", 2007, "9780545010221", 759, "The final book in the Harry Potter series, where Harry faces Voldemort in a final battle.", "https://res.cloudinary.com/dtjdlphzv/image/upload/v1733409900/hqkgjcgomkxjcjre7wsc.jpg"),
(15, "The Hunger Games", "Suzanne Collins", 2008, "9780439023481", 374, "A dystopian novel about a televised fight to the death.", "https://res.cloudinary.com/dtjdlphzv/image/upload/v1733409898/ainwfyi6ehtfmtxd6iop.jpg"),
(16, "Catching Fire", "Suzanne Collins", 2009, "9780439023498", 391, "The second book in The Hunger Games series, where Katniss faces new challenges.", "https://res.cloudinary.com/dtjdlphzv/image/upload/v1733409898/figxixcuvoqgfyten05d.jpg"),
(17, "Mockingjay", "Suzanne Collins", 2010, "9780439023504", 390, "The final book in The Hunger Games series, where Katniss leads a rebellion.", "https://res.cloudinary.com/dtjdlphzv/image/upload/v1733409895/u9jd8q8h3yksxexjeyt2.jpg"),
(18, "The Fellowship of the Ring", "J.R.R. Tolkien", 1954, "9780618002220", 423, "The first book in The Lord of the Rings series, where Frodo begins his journey.", "https://res.cloudinary.com/dtjdlphzv/image/upload/v1733409897/jvle7v2gdnmirouw0o3c.jpg"),
(19, "The Two Towers", "J.R.R. Tolkien", 1954, "9780618002237", 352, "The second book in The Lord of the Rings series, where the fellowship is divided.", "https://res.cloudinary.com/dtjdlphzv/image/upload/v1733409897/pjyfyf5hgsfxm9wmuslv.jpg"),
(20, "The Return of the King", "J.R.R. Tolkien", 1955, "9780618002244", 416, "The final book in The Lord of the Rings series, where the fate of Middle-earth is decided.", "https://res.cloudinary.com/dtjdlphzv/image/upload/v1733409897/yjiruht7jkszmu6f3lem.jpg"),
(21, "The Da Vinci Code", "Dan Brown", 2003, "9780385504208", 454, "A mystery thriller novel that explores the secrets of the Holy Grail.", "https://res.cloudinary.com/dtjdlphzv/image/upload/v1733409897/azm5gcutpiahyzruuyqy.jpg"),
(22, "The Shining", "Stephen King", 1977, "9780385121675", 447, "A horror novel about a haunted hotel and a family in peril.", "https://res.cloudinary.com/dtjdlphzv/image/upload/v1733409899/zbqfacup7pv8dbvbywhj.jpg"),
(23, "The Road", "Cormac McCarthy", 2006, "9780307387899", 287, "A post-apocalyptic novel about a father and son\'s journey.", "https://res.cloudinary.com/dtjdlphzv/image/upload/v1733409896/ddsmkx8yi210qb0lnhrz.jpg"),
(24, "Gone Girl", "Gillian Flynn", 2012, "9780307588364", 422, "A psychological thriller about a missing wife and the secrets of a marriage.", "https://res.cloudinary.com/dtjdlphzv/image/upload/v1733409896/zphdm6m1n7ocsa7ondq3.jpg"),
(25, "The Girl with the Dragon Tattoo", "Stieg Larsson", 2005, "9780307454547", 465, "A mystery novel about a journalist and a hacker investigating a disappearance.", "https://res.cloudinary.com/dtjdlphzv/image/upload/v1733409896/wwjxadunlycpytmobzs1.jpg");