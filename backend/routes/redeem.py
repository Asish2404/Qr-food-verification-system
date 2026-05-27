from fastapi import APIRouter
from database.db import collection, counter_collection
from models.qr_model import QRRequest
import json

router = APIRouter()

@router.post("/redeem")
async def redeem_coupon(data: QRRequest):

    try:

        print("RAW QR:", data.qr_data)

        qr_json = json.loads(data.qr_data)

        print("PARSED QR:", qr_json)

        coupon_id = qr_json["coupon_id"]

        print("SCANNED COUPON:", coupon_id)

        food_preference = qr_json["food_preference"]

        coupon = collection.find_one({
            "coupon_id": coupon_id
        })

        print("FOUND:", coupon)

        if not coupon:

            return {
                "success": False,
                "message": "Coupon not found"
            }

        if int(coupon["flag"]) == 0:

            counter_data = counter_collection.find_one(
                {},
                {
                    "_id": 0
                }
            )

            return {
                "success": False,
                "message": "QR already redeemed",
                "qr_data": qr_json,
                "counts": {
                    "veg": counter_data["veg_count"],
                    "nonveg": counter_data["nonveg_count"]
                }
            }

        result = collection.update_one(
            {
                "coupon_id": coupon_id
            },
            {
                "$set": {
                    "flag": 0
                }
            }
        )

        print("UPDATED:", result.modified_count)

        if food_preference == "veg":

            counter_collection.update_one(
                {},
                {
                    "$inc": {
                        "veg_count": 1
                    }
                }
            )

        elif food_preference == "non-veg":

            counter_collection.update_one(
                {},
                {
                    "$inc": {
                        "nonveg_count": 1
                    }
                }
            )

        counter_data = counter_collection.find_one(
            {},
            {
                "_id": 0
            }
        )

        qr_json["flag"] = 0

        return {
            "success": True,
            "message": "QR redemption successful",
            "qr_data": qr_json,
            "counts": {
                "veg": counter_data["veg_count"],
                "nonveg": counter_data["nonveg_count"]
            }
        }

    except Exception as e:

        print("ERROR:", e)

        return {
            "success": False,
            "message": "Invalid QR Code"
        }