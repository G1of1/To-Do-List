import sqlite3

db_name = 'tasks.db'
def initialize_db():
    with sqlite3.connect(db_name) as conn:
        cursor = conn.cursor()
        cursor.execute('''CREATE TABLE IF NOT EXISTS tasks(id INTEGER PRIMARY KEY, name TEXT)''')
        conn.commit()




def getList():
    with sqlite3.connect(db_name) as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM tasks')
        rows = cursor.fetchall()
        return [{"id": row[0], "name": row[1]} for row in rows]


def addtoList(name: str):
    with sqlite3.connect(db_name) as conn:
        cursor = conn.cursor()
        cursor.execute('INSERT INTO tasks (name) VALUES (?)', 
                       (name,))
        conn.commit()

def deletefromList(name: str):
    with sqlite3.connect(db_name) as conn:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM tasks WHERE name = ?', (name,))
        conn.commit()
        
        # Check if any rows were deleted
        if cursor.rowcount == 0:
            raise ValueError(f"Task with name '{name}' not found")
        


if __name__ == '__main__':
    initialize_db()
    print("Database initialized successfully.")