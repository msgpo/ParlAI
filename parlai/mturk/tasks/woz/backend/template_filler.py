from typing import Dict, Text, Any, List, Optional

from parlai.mturk.tasks.woz.backend import constants


def fill_hello(intent2reply, *_):
    return intent2reply[constants.INTENT_HELLO]


def fill_ask_name(intent2reply, *_):
    return intent2reply[constants.INTENT_ASK_NAME]


def fill_ride_ask_destination(intent2reply, *_):
    return intent2reply[constants.INTENT_RIDE_ASK_DESTINATION]


def fill_ride_ask_departure(intent2reply, *_):
    return intent2reply[constants.INTENT_RIDE_ASK_DEPARTURE]


def fill_ride_ask_confirm_booking(intent2reply, kb_item):
    if not check_kb_item(
        kb_item,
        [
            "ServiceProvider",
            "Price",
            "MinutesTillPickup",
            "DepartureLocation",
            "ArrivalLocation",
        ],
    ):
        return None
    return intent2reply[constants.INTENT_RIDE_ASK_CONFIRM_BOOKING].format(
        service_provider=kb_item["ServiceProvider"],
        departure_location=kb_item["DepartureLocation"],
        arrival_location=kb_item["ArrivalLocation"],
        price=kb_item["Price"],
        minutes_till_pickup=kb_item["MinutesTillPickup"],
    )


def fill_ride_bye(intent2reply, *_):
    return intent2reply[constants.INTENT_RIDE_BYE]


def fill_ride_confirm_booking(intent2reply, kb_item):
    if not check_kb_item(kb_item, ["CarModel", "id", "LicensePlate"]):
        return None
    return intent2reply[constants.INTENT_RIDE_CONFIRM_BOOKING].format(
        car_model=kb_item["CarModel"],
        booking_id=kb_item["id"],
        license_plate=kb_item["LicensePlate"],
    )


def fill_ride_inform_search_criteria(intent2reply, *_):
    return intent2reply[constants.INTENT_RIDE_INFORM_SEARCH_CRITERIA]


def fill_ride_provide_driver_details(intent2reply, kb_item):
    if not check_kb_item(kb_item, ["DriverName"]):
        return None
    return intent2reply[constants.INTENT_RIDE_PROVIDE_DRIVER_DETAILS].format(
        driver_name=kb_item["DriverName"],
    )


def check_kb_item(
    kb_item: Dict[Text, Any], required_fields: Optional[List[Text]] = None
) -> bool:
    if not required_fields:
        return kb_item is not None
    else:
        return kb_item and all(key in kb_item for key in required_fields)
