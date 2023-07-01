CREATE SCHEMA receipts COLLATE utf8_general_ci;
GRANT ALL PRIVILEGES ON receipts.* TO receipts_user;
FLUSH PRIVILEGES;

CREATE TABLE receipts.draw_account
(
    id      BIGINT          AUTO_INCREMENT,
    name    VARCHAR(255),
    CONSTRAINT draw_account_pk
        PRIMARY KEY (id)
)
    COMMENT 'Credit/Debit Card or Cash';

INSERT INTO receipts.draw_account (name)
VALUES ('Test Card');

CREATE TABLE receipts.location
(
    id      BIGINT          AUTO_INCREMENT,
    name    VARCHAR(255),
    CONSTRAINT location_pk
        PRIMARY KEY (id)
)
    COMMENT 'Normalized name of purchase location';

INSERT INTO receipts.location (name) VALUES ('Test Location');

CREATE TABLE receipts.receipts
(
    id           BIGINT                         AUTO_INCREMENT,
    date         DATE                           NOT NULL,
    location     VARCHAR(255)                   NOT NULL,
    subtotal     DECIMAL(5, 2)                  NOT NULL,
    sales_tax    DECIMAL(5, 2)  DEFAULT 0.00    NOT NULL,
    donation     DECIMAL(5, 2)  DEFAULT 0.00    NOT NULL,
    draw_account BIGINT         DEFAULT 0       NOT NULL,
    CONSTRAINT receipts_pk
        PRIMARY KEY (id),
    CONSTRAINT receipts_draw_account_id_fk
        FOREIGN KEY (draw_account) REFERENCES draw_account (id)
)
    comment 'Table holding the receipt information for each purchase';

CREATE INDEX receipts_date_index ON receipts.receipts (date DESC);
CREATE INDEX receipts_date_location_index ON receipts.receipts (date DESC, location ASC);

create table receipts.notes
(
    id          BIGINT          AUTO_INCREMENT,
    receipt_id  BIGINT          NOT NULL,
    note        VARCHAR(1000)   NOT NULL,
    CONSTRAINT notes_pk
        PRIMARY KEY (id),
    CONSTRAINT notes_receipts_id_fk
        FOREIGN KEY (receipt_id) REFERENCES receipts (id)
            ON UPDATE CASCADE ON DELETE CASCADE
)
    comment 'Many-to-one notes for each receipt';

CREATE INDEX notes_receipt_id_index
    ON notes (receipt_id DESC);

CREATE TABLE receipts.scheduled
(
    id                      INT     NOT NULL,
    reference_receipt_id    BIGINT  NOT NULL,
    repeat_interval         INT     NOT NULL,
    next_date               DATE    NOT NULL,
    CONSTRAINT scheduled_pk
        PRIMARY KEY (id),
    CONSTRAINT scheduled_receipts_id_fk
        FOREIGN KEY (reference_receipt_id) REFERENCES receipts (id)
            ON DELETE CASCADE
)
    COMMENT 'Scheduled or repeating receipts';

CREATE INDEX scheduled_next_date_index ON scheduled (next_date DESC);
