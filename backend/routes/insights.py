from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.database import connect_db
from datetime import datetime, timedelta

insights_bp = Blueprint('insights', __name__)

@insights_bp.route('/insights', methods=['GET'])
@jwt_required()
def get_insights():
    """Very basic example advice based on last 30days spent per category."""

    user_id = get_jwt_identity()
    conn = connect_db()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    cursor = conn.cursor(dictionary=True)

    thirty_days_ago = datetime.today() - timedelta(days=30)
    cursor.execute("""
        SELECT category, SUM(amount) AS total
        FROM transactions
        WHERE user_id = %s AND type = 'expense' AND created_at >= %s
        GROUP BY category
    """, (user_id, thirty_days_ago))
    rows = cursor.fetchall()

    total_all = sum(row['total'] for row in rows)
    advice = []
    for row in rows:
        cat = row['category']
        tot = float(row['total'])
        pct = tot / total_all * 100 if total_all > 0 else 0
        if pct > 25:
            advice.append({
                "title": f"Review your '{cat}' spending",
                "text": f"You have spent ${tot:.2f} ({pct:.0f}% of your last 30-day expenses)"
                f"on '{cat}'. Consider setting a tighter budget or finding ways to cut back."
            })
            
            advice.append({
                "title": "Take advantage of roundup savings",
                "text": "Enable automatic roundup savings to save spare change on every purchase."
            })

            cursor.close()
            conn.close()
            return jsonify({"advice":advice}), 200
    