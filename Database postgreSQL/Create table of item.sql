create table invoice_table(
item_no serial primary key,
invoice_id varchar(200),
invoice_title varchar(200),
invoice_date timestamp,
customer varchar(200),
product_name varchar(200),
price float,
quantity int
)

select * from invoice_table;
