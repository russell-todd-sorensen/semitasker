/* Create the Jabber database */

/* $Id: database.sql,v 1.1.1.1 2001/09/23 17:41:08 nsadmin Exp $ */

/* User information table - authentication information and profile */
CREATE TABLE j_users (
  username VARCHAR(32) NOT NULL PRIMARY KEY,
  password VARCHAR(16) NOT NULL
);
CREATE INDEX I_users_login ON j_users (username, password);

CREATE TABLE users0k (
  username VARCHAR(32) NOT NULL PRIMARY KEY,
  hash     VARCHAR(41) NOT NULL,
  token    VARCHAR(10) NOT NULL,
  sequence VARCHAR(3)  NOT NULL
);

CREATE TABLE last (
  username VARCHAR(32) NOT NULL PRIMARY KEY,
  seconds  VARCHAR(32) NOT NULL,
  state	   VARCHAR(32)
);

/* User resource mappings */
CREATE TABLE userres (
  username VARCHAR(32) NOT NULL,
  resource VARCHAR(32) NOT NULL
);
CREATE UNIQUE INDEX PK_userres ON userres (username, resource);

/* Roster listing */
CREATE TABLE rosterusers (
  username VARCHAR(32) NOT NULL,
  jid VARCHAR(255) NOT NULL,
  nick VARCHAR(255),
  subscription CHAR(1) NOT NULL,  /* 'N', 'T', 'F', or 'B' */
  ask CHAR(1) NOT NULL,           /* '-', 'S', or 'U' */
  server CHAR(1) NOT NULL,         /* 'Y' or 'N' */
  subscribe VARCHAR(10)
);
CREATE INDEX I_rosteru_username ON rosterusers (username);

CREATE TABLE rostergroups
(
  username VARCHAR(32) NOT NULL,
  jid VARCHAR(255) NOT NULL,
  grp VARCHAR(64) NOT NULL
);
CREATE UNIQUE INDEX PK_rosterg_user_jid ON rostergroups (username, jid);

/* Spooled offline messages */
CREATE TABLE spool (
  username VARCHAR(32) NOT NULL,
  receiver VARCHAR(255) NOT NULL,
  sender VARCHAR(255) NOT NULL,                 
  id VARCHAR(255),
  date TIMESTAMP,
  priority INT,
  type VARCHAR(32),
  thread VARCHAR(255),
  subject VARCHAR(255),
  message TEXT,
  extension TEXT
);
CREATE INDEX I_despool on spool (username, date);

CREATE TABLE filters (
  username     VARCHAR(32),
  unavailable  VARCHAR(1),
  sender       VARCHAR(255),
  resource     VARCHAR(32),
  subject      VARCHAR(255),
  body         TEXT,
  show_state   VARCHAR(8),
  type         VARCHAR(8),
  offline      VARCHAR(1),
  forward      VARCHAR(32),
  reply        TEXT,
  continue     VARCHAR(1),
  settype      VARCHAR(8)
);

CREATE TABLE vcard (
  username   VARCHAR(32) PRIMARY KEY,
  full_name  VARCHAR(65),
  first_name VARCHAR(32),
  last_name  VARCHAR(32),
  nick_name  VARCHAR(32),
  url        VARCHAR(255),
  address1   VARCHAR(255),
  address2   VARCHAR(255),
  locality   VARCHAR(32),
  region     VARCHAR(32),
  pcode      VARCHAR(32),
  country    VARCHAR(32),
  telephone  VARCHAR(32),
  email      VARCHAR(127),
  orgname    VARCHAR(32),
  orgunit    VARCHAR(32),
  title      VARCHAR(32),
  role       VARCHAR(32),
  b_day      DATE,
  descr      TEXT
);

CREATE TABLE yahoo (
  username   VARCHAR(32) PRIMARY KEY,
  yahoo_id   VARCHAR(100) NOT NULL,
  yahoo_pass VARCHAR(32) NOT NULL
);

/* Grant privileges to some users */
GRANT ALL ON users, users0k, last, userres, rosterusers, rostergroups, spool, filters, vcard, yahoo TO jabber;
