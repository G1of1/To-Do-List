from flask import Flask, request, jsonify, render_template

from to_do import(initialize_db, getList, addtoList, deletefromList)

app = Flask(__name__)

initialize_db()

#----INDEX ROUTE---#
@app.route('/')
def index():
    return render_template('index.html')


#----HANDLING OF TASKS----#
@app.route('/tasks', methods =['GET', 'POST'])
def handle_list():
    if request.method == 'GET':
        tasks = getList()
        return jsonify(tasks)
    
    if request.method == 'POST':
        data = request.get_json()

        if not data or 'name' not in data:
            return jsonify({"error": "Missing required 'name' field"}), 400
        
        try:
            addtoList(data['name'])
            return jsonify({"message": "Successfully added to list"}), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 500

#---DELETION OF TASKS---#
@app.route('/tasks', methods =['DELETE'])
def delete_task():
    data = request.get_json()
    if not data or 'name' not in data:
        return jsonify({"error": "Missing required 'name' field"}), 400
    
    try:
        deletefromList(data['name'])
        return jsonify({"message": "Task deleted successfully"}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500



    

if __name__ == "__main__":
    app.run(debug=True)
    


    