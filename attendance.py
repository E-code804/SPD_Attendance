from dotenv import load_dotenv
from pymongo import MongoClient
import openpyxl
import os

"""
    If a brother was present, they get a 1.
    If they are with a valid excuse, they get a 0.
    If they are totally missing (not in brother names set), they get a -1.
"""
brothers_set = set(["Erik Pfeffer", "Jack Spoleti", "Nithin Nambi", "Sans", "Aaron"])

# Load environment variables from .env and new excel file.
load_dotenv()
uri = os.getenv("MONGO_CONNECTION_STRING")


def get_db():
    client = MongoClient(uri)
    return client["SPD_Attendence"]


if __name__ == "__main__":
    try:
        db = get_db()
        xl = openpyxl.Workbook()
        sheet = xl.active
        sheet.title = "Attendance_11_30_23"

        attending = db["attended"]
        attendees = attending.find()
        # attendees = sorted(attendees, key=lambda attendees: attendees["name"])
        missed = db["missed"]
        missees = missed.find()

        brothers = (
            {}
        )  # Avoid using the name 'all' as it's a built-in function in Python

        # Assuming 'attendees' and 'missees' are dictionaries
        for a in attendees:
            brothers[a["name"]] = a

        for m in missees:
            brothers[m["name"]] = m

        for brother in brothers_set:
            if brother not in brothers.keys():
                brothers[brother] = {"name": brother, "no_response": -1}

        # Sort brother based on name
        brothers = dict(sorted(brothers.items(), key=lambda item: item[1]["name"]))
        for brother_name in brothers:
            brother = brothers[brother_name]
            print(brother)
            if brother.get("no_response", 0) == -1:
                sheet.append([brother_name, -1])
            elif brother.get("excuse", "") != "":
                sheet.append([brother_name, 0])
            else:
                sheet.append([brother_name, 1])

        xl.save("ex.xlsx")

    except Exception as e:
        print(f"An error occurred: {e}")
