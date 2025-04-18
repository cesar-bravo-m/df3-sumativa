DROP TABLE POSTS CASCADE CONSTRAINTS PURGE;
DROP TABLE THREADS CASCADE CONSTRAINTS PURGE;
DROP TABLE CATEGORIES CASCADE CONSTRAINTS PURGE;

DROP SEQUENCE CATEGORY_SEQ;
DROP SEQUENCE THREAD_SEQ;
DROP SEQUENCE POST_SEQ;

CREATE SEQUENCE CATEGORY_SEQ START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE THREAD_SEQ START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE POST_SEQ START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE CATEGORIES (
    ID NUMBER PRIMARY KEY,
    NAME VARCHAR2(100) NOT NULL,
    DESCRIPTION VARCHAR2(500)
);

CREATE TABLE THREADS (
    ID NUMBER PRIMARY KEY,
    TITLE VARCHAR2(200) NOT NULL,
    CREATED_AT TIMESTAMP NOT NULL,
    LAST_UPDATED_AT TIMESTAMP,
    USER_ID NUMBER NOT NULL,
    CATEGORY_ID NUMBER NOT NULL,
    CONSTRAINT FK_THREAD_CATEGORY FOREIGN KEY (CATEGORY_ID) REFERENCES CATEGORIES (ID)
);

CREATE TABLE POSTS (
    ID NUMBER PRIMARY KEY,
    CONTENT CLOB NOT NULL,
    CREATED_AT TIMESTAMP NOT NULL,
    LAST_UPDATED_AT TIMESTAMP,
    USER_ID NUMBER NOT NULL,
    THREAD_ID NUMBER NOT NULL,
    CONSTRAINT FK_POST_THREAD FOREIGN KEY (THREAD_ID) REFERENCES THREADS (ID)
);

CREATE INDEX IDX_THREAD_CATEGORY ON THREADS(CATEGORY_ID);
CREATE INDEX IDX_POST_THREAD ON POSTS(THREAD_ID); 