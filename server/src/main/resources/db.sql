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

CREATE TABLE receipts.location
(
    id   BIGINT AUTO_INCREMENT,
    name VARCHAR(255),
    CONSTRAINT location_pk
        PRIMARY KEY (id)
)
    COMMENT 'Normalized name of purchase location';

INSERT INTO receipts.location (name) VALUES ('Test Location');

CREATE TABLE receipts.receipts
(
    id           BIGINT                     AUTO_INCREMENT,
    date         DATE                       NOT NULL,
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
    comment 'Table holding the receipt information for each purchase';

CREATE INDEX receipts_date_index ON receipts.receipts (date DESC);
CREATE INDEX receipts_date_location_index ON receipts.receipts (date DESC, location ASC);

INSERT INTO receipts.receipts (
    date,
    location,
    subtotal,
    sales_tax,
    draw_account
) VALUES (
     '2023-01-01',
     (SELECT id FROM receipts.location WHERE name = 'Test Location'),
     12.34,
     5.67,
     (SELECT id FROM receipts.draw_account WHERE name = 'Test Card')
 );