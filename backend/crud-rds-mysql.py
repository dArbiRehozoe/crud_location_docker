from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS
import threading
from connection import config
import logging
app = Flask(__name__)
CORS(app)


logging.basicConfig(filename='access.log', level=logging.INFO, 
                    format='%(asctime)s [%(levelname)s] %(message)s', datefmt='%Y-%m-%d %H:%M:%S')
access_logger = logging.getLogger('access_logger')

@app.before_request
def log_request_info():
    log_data = f"{request.remote_addr} - {request.method} {request.path} - {request.user_agent}"
    access_logger.info(log_data)

# Create connection to the MySQL database
db = mysql.connector.connect(**config)
# Create a cursor object to interact with the database
cursor = db.cursor()
lock= threading.Lock();
# Create the 'location' table if it doesn't exist
create_table_query = """
    CREATE TABLE IF NOT EXISTS location (
        numloc INT AUTO_INCREMENT PRIMARY KEY,
        nom_loc varchar(255) DEFAULT NULL,
        design_voiture varchar(255) DEFAULT NULL,
        Nombre_de_jours int(11) DEFAULT NULL,
        taux_journalier decimal(10,2) DEFAULT NULL
 )
 """
cursor.execute(create_table_query)


# Route to get all location
@app.route('/location', methods=['GET'])
def get_location():

      # Acquire the lock
    lock.acquire()

    try:
        select_query = "SELECT * FROM location"
        cursor.execute(select_query)
        location = cursor.fetchall()
        
        # Convert the result to a list of dictionaries
        location_list = []
        
        for loc in location:
            loyer =loc[3]* loc[4];
            location_dict = {
                'numloc': loc[0],
                'nom_loc': loc[1],
                'design_voiture': loc[2],
                'Nombre_de_jours': loc[3],
                'taux_journalier': loc[4],
                'loyer':loyer
            }
            location_list.append(location_dict)

        return jsonify(location_list)
    finally:
        # Release the lock
        lock.release()

# Route to add a new location
@app.route('/add_location', methods=['POST'])
def add_location():
    location_data = request.get_json()
    nom_loc = location_data.get('nom_loc')
    design_voiture = location_data.get('design_voiture')
    Nombre_de_jours= location_data.get("Nombre_de_jours")
    taux_journalier= location_data.get("taux_journalier")


    insert_query = "INSERT INTO location (nom_loc,design_voiture,Nombre_de_jours,taux_journalier) VALUES (%s,%s,%s,%s)"
    cursor.execute(insert_query, (nom_loc,design_voiture,Nombre_de_jours,taux_journalier))
    db.commit()
    
    return jsonify({'message': 'location added successfully'}), 201



# Route to update an existing location
@app.route('/update_location/<int:numloc>', methods=['PUT'])
def update_location(numloc):
    location_data = request.get_json()
    nom_loc = location_data.get('nom_loc')
    design_voiture = location_data.get('design_voiture')
    Nombre_de_jours= location_data.get("Nombre_de_jours")
    taux_journalier= location_data.get("taux_journalier")
    print(numloc)
    print(nom_loc)
    print(design_voiture)
    print(Nombre_de_jours)
    print(taux_journalier)

    # Acquire the lock
    lock.acquire()

    try:
        update_query = "UPDATE location SET nom_loc=%s ,design_voiture=%s ,Nombre_de_jours=%s,taux_journalier=%s WHERE numloc=%s"
        cursor.execute(update_query, (nom_loc,design_voiture,Nombre_de_jours,taux_journalier,numloc))
        db.commit()

        return jsonify({'message': 'Book updated successfully'})
    finally:
        # Release the lock
        lock.release()


# Route to delete a location
@app.route('/delete_location/<int:numloc>', methods=['DELETE'])
def delete_location(numloc):
    delete_query = "DELETE FROM location WHERE numloc=%s"
    cursor.execute(delete_query, (numloc,))
    db.commit()
    
    return jsonify({'message': 'Book deleted successfully'})




# Route to get all locationloyer
@app.route('/loyerTotalMinMax', methods=['GET'])
def get_locationloyer():
    somme=0;
   
    max1=0;
     # Acquire the lock
    lock.acquire()

    try:
        select_query = "SELECT * FROM location"
        cursor.execute(select_query)
        location = cursor.fetchall()
        
        # Convert the result to a list of dictionaries
        location_list = []
        min1=location[0][3]*location[0][4];
        for loc in location:
            loyer =loc[3]* loc[4];
            somme+=loyer;
            if(loyer<min1):
                min1=loyer
            if (loyer>max1):
                max1=loyer
        location_dict = {
                'total':somme,
                'min':min1,
                'max':max1
            }
        location_list.append(location_dict)    
        
        return jsonify(location_list)
    finally:
        # Release the lock
        lock.release()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
