"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, get_jwt
from datetime import timedelta
from flask import Flask, request, jsonify, url_for, Blueprint, current_app
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():


    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route("/login", methods=["POST"] )
def login_v2():
    try:
        email = request.json.get("email")
        password = request.json.get("password")
        
        # Retrieve the user by email
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({"error": "Email not found"}), 404
        
        # Verify the password

        valid_password = current_app.bcrypt.check_password_hash(user.password, password)
        if not valid_password:
            return jsonify({"msg": "Incorrect email or password"}), 401
        
        # Include foundation ID in token by setting additional claims
        additional_claims = {"email": user.id}
        access_token = create_access_token(
            identity=email, 
            additional_claims=additional_claims,
            expires_delta=timedelta(weeks=1)
        )
        
        return jsonify(access_token=access_token, user=user.serialize()), 200




    except Exception as e:
        # Log the exception for debugging
        print(f"Error during login: {e}")
        
        # Return a generic error response
        return jsonify({"error": "An error occurred during login.", "details": str(e)}), 500



@api.route("/signup", methods=["POST"])
def signup():
    try:
        body = request.get_json()
        
        # Verificar si el email ya existe
        user = User.query.filter_by(email=body["email"]).first()
        if user  is not None:
            return jsonify({"msg": "A user was created with that email"}), 401
        
        # Hashear la contraseña
        password_hash = current_app.bcrypt.generate_password_hash(body["password"]).decode("utf-8")
        
        # Crear nuevo usuario
        user = User(
            email=body["email"],
            password=password_hash,
            is_active=True
        )
        db.session.add(user)
        db.session.commit()
        
        response_body = {
            "msg": "User was created successfully",
            "user": user .id,
            "email": user.email,
        }
        return jsonify(response_body), 200
    
    except Exception as e:
        print(f"Error during signup: {e}")
        return jsonify({"error": "An error occurred during signup.", "details": str(e)}), 500
