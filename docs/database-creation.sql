-- postgre
create table wedding.guests
(
    id                       smallserial primary key,
    token                    varchar(20)                    not null,
    type                     varchar(10)                    not null,
    full_name                varchar(50)                    not null,
    email                    varchar(70)                    not null,
    status                   varchar(10) default 'NOT_SENT' not null,
    meal_type                varchar(10)                    null,
    celiac                   boolean  default false         not null,
    allergic                 boolean  default false         not null,
    allergy_comment          varchar(255)                   null,
    has_children             boolean  default false         not null,
    children                 int      default 0             not null,
    has_plus_one             boolean  default false         not null,
    with_plus_one            boolean  default false         not null,
    plus_one_full_name       varchar(50)                    null,
    plus_one_meal_type       varchar(10)                    null,
    plus_one_celiac          boolean                        null,
    plus_one_allergic        boolean                        null,
    plus_one_allergy_comment varchar(255)                   null,
    constraint guests_token_uindex unique (token)
);


-- mysql
create table guests
(
    id                       int auto_increment primary key,
    token                    varchar(20)                    not null,
    type                     varchar(10)                    not null,
    full_name                varchar(50)                    not null,
    email                    varchar(70)                    not null,
    status                   varchar(10) default 'NOT_SENT' not null,
    meal_type                varchar(10)                    null,
    celiac                   tinyint(1)  default 0          not null,
    allergic                 tinyint(1)  default 0          not null,
    allergy_comment          varchar(255)                   null,
    has_children             tinyint(1)  default 0          not null,
    children                 int         default 0          not null,
    has_plus_one             tinyint(1)  default 0          not null,
    with_plus_one            tinyint(1)  default 0          not null,
    plus_one_full_name       varchar(50)                    null,
    plus_one_meal_type       varchar(10)                    null,
    plus_one_celiac          tinyint(1)                     null,
    plus_one_allergic        tinyint(1)                     null,
    plus_one_allergy_comment varchar(255)                   null,
    constraint guests_token_uindex unique (token)
);

