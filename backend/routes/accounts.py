from flask import Blueprint, jsonify
from flask_jwt_extended import \
    jwt_required, get_jwt_identity

accounts_bp = Blueprint('accounts', __name__)

@accounts_bp.route('/account', methods=['GET'])
@jwt_required()
def get_account():
    from models import Account
    user_id = get_jwt_identity()
    account = Account.query.filter_by(
        user_id=user_id).first()
    return jsonify({
        'account_number': account.account_number,
        'balance': account.balance,
        'account_type': account.account_type})