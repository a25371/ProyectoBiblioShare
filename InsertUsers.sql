// Inserts para la presentacion!

INSERT INTO `users` (`id`, `username`, `password`, `pronouns`) VALUES ('1', 'Admin', 'admin', 'they/them');
INSERT INTO `users` (`id`, `username`, `password`, `pronouns`) VALUES ('4', 'Irene', 'Irene', 'She/Them');
INSERT INTO `users` (`id`, `username`, `password`, `pronouns`) VALUES ('5', 'Fran', 'Fran', 'He/Him');

INSERT INTO `watched_users` (`user_id`, `watched_user_id`) VALUES ('5', '4'), ('4', '5');
