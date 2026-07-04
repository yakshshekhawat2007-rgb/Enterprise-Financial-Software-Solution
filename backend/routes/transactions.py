from flask import Blueprint, request, jsonify
from flask_jwt_extended import \
    jwt_required, get_jwt_identity

trans_bp = Blueprint('transactions', __name__)

@trans_bp.route('/deposit', methods=['POST'])
@jwt_required()
def deposit():
    from app import db
    from models import Account, Transaction
    user_id = get_jwt_identity()
    data = request.json
    account = Account.query.filter_by(
        user_id=user_id).first()
    account.balance += data['amount']
    trans = Transaction(
        from_account=account.account_number,
        to_account=account.account_number,
        amount=data['amount'],
        type='deposit',
        description='Deposit')
    db.session.add(trans)
    db.session.commit()
    return jsonify({
        'message': 'Deposited!',
        'new_balance': account.balance})

@trans_bp.route('/withdraw', methods=['POST'])
@jwt_required()
def withdraw():
    from app import db
    from models import Account, Transaction
    user_id = get_jwt_identity()
    data = request.json
    account = Account.query.filter_by(
        user_id=user_id).first()
    if account.balance < data['amount']:
        return jsonify({
            'error': 'Low balance!'}), 400
    account.balance -= data['amount']
    trans = Transaction(
        from_account=account.account_number,
        to_account='BANK',
        amount=data['amount'],
        type='withdrawal',
        description='Withdrawal')
    db.session.add(trans)
    db.session.commit()
    return jsonify({
        'message': 'Withdrawn!',
        'new_balance': account.balance})

@trans_bp.route('/transfer', methods=['POST'])
@jwt_required()
def transfer():
    from app import db
    from models import Account, Transaction
    user_id = get_jwt_identity()
    data = request.json
    sender = Account.query.filter_by(
        user_id=user_id).first()
    receiver = Account.query.filter_by(
        account_number=data['to_account']
    ).first()
    if not receiver:
        return jsonify({
            'error': 'Account not found!'}), 404
    if sender.balance < data['amount']:
        return jsonify({
            'error': 'Low balance!'}), 400
    sender.balance -= data['amount']
    receiver.balance += data['amount']
    trans = Transaction(
        from_account=sender.account_number,
        to_account=receiver.account_number,
        amount=data['amount'],
        type='transfer',
        description='Transfer')
    db.session.add(trans)
    db.session.commit()
    return jsonify({
        'message': 'Transferred!',
        'new_balance': sender.balance})

@trans_bp.route('/history', methods=['GET'])
@jwt_required()
def history():
    from models import Account, Transaction
    user_id = get_jwt_identity()
    account = Account.query.filter_by(
        user_id=user_id).first()
    transactions = Transaction.query.filter(
        (Transaction.from_account ==
            account.account_number) |
        (Transaction.to_account ==
            account.account_number)
    ).order_by(
        Transaction.timestamp.desc()).all()
    return jsonify([{
        'type': t.type,
        'amount': t.amount,
        'from': t.from_account,
        'to': t.to_account,
        'description': t.description,
        'date': str(t.timestamp)
    } for t in transactions])