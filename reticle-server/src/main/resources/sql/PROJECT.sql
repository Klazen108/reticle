CREATE TABLE IF NOT EXISTS PROJECT(
	ID INT PRIMARY KEY auto_increment, 
	DASHBOARD_ID INT, 
	NAME VARCHAR(255),
	BRANCH VARCHAR(255),
	RELEASE VARCHAR(255),
	PROJECT VARCHAR(255),
	GC VARCHAR(255),
	FOLDER VARCHAR(255)
);