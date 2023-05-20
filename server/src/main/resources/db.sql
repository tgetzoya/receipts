CREATE SCHEMA receipts COLLATE utf8_general_ci;
GRANT ALL PRIVILEGES ON receipts.* TO receipts_user;
FLUSH PRIVILEGES;

CREATE TABLE receipts.draw_account
(
    id   BIGINT AUTO_INCREMENT,
    name VARCHAR(255),
    CONSTRAINT draw_account_pk
        PRIMARY KEY (id)
)
    COMMENT 'Credit/Debit Card or Cash';

INSERT INTO receipts.draw_account (name)
VALUES ('Test Card');

CREATE TABLE receipts.receipts
(
    id           bigint auto_increment,
    location     VARCHAR(255)               NOT NULL,
    subtotal     DECIMAL(5, 2)              NOT NULL,
    sales_tax    DECIMAL(5, 2) DEFAULT 0.00 NOT NULL,
    donation     DECIMAL(5, 2) DEFAULT 0.00 NOT NULL,
    draw_account BIGINT        DEFAULT 0    NOT NULL,
    CONSTRAINT receipts_pk
        PRIMARY KEY (id),
    CONSTRAINT receipts_draw_account_id_fk
        FOREIGN KEY (draw_account) REFERENCES draw_account (id)
)
    comment 'Receipts';

INSERT INTO receipts.receipts (location,
                               subtotal,
                               sales_tax,
                               draw_account)
VALUES ('Test Location',
        12.34,
        5.67,
        (SELECT id FROM receipts.draw_account WHERE name = 'Test Card'));