from typing import List
from typing import Any
from dataclasses import dataclass

@dataclass
class Address:
    Street: str
    Village: str
    Province: str
    ZIP: str

    @staticmethod
    def from_dict(obj: Any) -> 'Address':
        _Street = str(obj.get("Street"))
        _Village = str(obj.get("Village"))
        _Province = str(obj.get("Province"))
        _ZIP = str(obj.get("ZIP"))
        return Address(_Street, _Village, _Province, _ZIP)
    
@dataclass
class Municipality:
    Municipality_Code: str
    Municipality_Name: str

    @staticmethod
    def from_dict(obj: Any) -> 'Municipality':
        _Municipality_Code = str(obj.get("Municipality_Code"))
        _Municipality_Name = str(obj.get("Municipality_Name"))
        return Municipality(_Municipality_Code, _Municipality_Name)

@dataclass
class Province:
    Province_Code: str
    Province_Name: str

    @staticmethod
    def from_dict(obj: Any) -> 'Province':
        _Province_Code = str(obj.get("Province_Code"))
        _Province_Name = str(obj.get("Province_Name"))
        return Province(_Province_Code, _Province_Name)

@dataclass
class CAPCode:
    Province: Province
    Municipality: Municipality
    Agregate: str
    Zone: str
    Polygon: str
    Parcel: str
    Enclosure: str

    @staticmethod
    def from_dict(obj: Any) -> 'CAPCode':
        _Province = Province.from_dict(obj.get("Province"))
        _Municipality = Municipality.from_dict(obj.get("Municipality"))
        _Agregate = str(obj.get("Agregate"))
        _Zone = str(obj.get("Zone"))
        _Polygon = str(obj.get("Polygon"))
        _Parcel = str(obj.get("Parcel"))
        _Enclosure = str(obj.get("Enclosure"))
        return CAPCode(_Province, _Municipality, _Agregate, _Zone, _Polygon, _Parcel, _Enclosure)

@dataclass
class Crop:
    Species: str
    Variety: str

    @staticmethod
    def from_dict(obj: Any) -> 'Crop':
        _Species = str(obj.get("Species"))
        _Variety = str(obj.get("Variety"))
        return Crop(_Species, _Variety)

@dataclass
class ExploitationParcel:
    Parcel_Id: str
    CAP_Code: CAPCode
    Use: str
    Official_Area: str
    Used_Area: str
    Crop: Crop
    Rainfed_Irrigated: str
    Protected_Area: str = None

    @staticmethod
    def from_dict(obj: Any) -> 'ExploitationParcel':
        _Parcel_Id = str(obj.get("Parcel_Id"))
        _CAP_Code = CAPCode.from_dict(obj.get("CAP_Code"))
        _Use = str(obj.get("Use"))
        _Official_Area = str(obj.get("Official_Area"))
        _Used_Area = str(obj.get("Used_Area"))
        _Crop = Crop.from_dict(obj.get("Crop"))
        _Rainfed_Irrigated = str(obj.get("Rainfed_Irrigated"))
        _Protected_Area = str(obj.get("Protected_Area?"))
        return ExploitationParcel(_Parcel_Id, _CAP_Code, _Use, _Official_Area, _Used_Area, _Crop, _Rainfed_Irrigated, _Protected_Area)

@dataclass
class IdentifierCode:
    Type: str
    Code: str

    @staticmethod
    def from_dict(obj: Any) -> 'IdentifierCode':
        _Type = str(obj.get("Type"))
        _Code = str(obj.get("Code"))
        return IdentifierCode(_Type, _Code)
    
@dataclass
class FarmHolder:
    Name: str
    Identifier_Code: List[IdentifierCode]
    Address: Address
    Phone: List[str]
    Email: str

    @staticmethod
    def from_dict(obj: Any) -> 'FarmHolder':
        _Name = str(obj.get("Name"))
        _Identifier_Code = [IdentifierCode.from_dict(y) for y in obj.get("Identifier_Code")]
        _Address = Address.from_dict(obj.get("Address"))
        _Phone = [str(y) for y in obj.get("Phone")]
        _Email = str(obj.get("Email"))
        return FarmHolder(_Name, _Identifier_Code, _Address, _Phone, _Email)

@dataclass
class HeatlhAdvisor:
    HAd_Id: str
    Name: str
    NIF_Code: str
    ROPO_Code: str
    Carnet_Type: str

    @staticmethod
    def from_dict(obj: Any) -> 'HeatlhAdvisor':
        _HAd_Id = str(obj.get("HAd_Id"))
        _Name = str(obj.get("Name"))
        _NIF_Code = str(obj.get("NIF_Code"))
        _ROPO_Code = str(obj.get("ROPO_Code"))
        _Carnet_Type = str(obj.get("Carnet Type"))
        return HeatlhAdvisor(_HAd_Id, _Name, _NIF_Code, _ROPO_Code, _Carnet_Type)

@dataclass
class Farm:
    FarmHolder: FarmHolder
    HeatlhAdvisor: List[HeatlhAdvisor]

    @staticmethod
    def from_dict(obj: Any) -> 'Farm':
        _FarmHolder = FarmHolder.from_dict(obj.get("FarmHolder"))
        _HeatlhAdvisor = [HeatlhAdvisor.from_dict(y) for y in obj.get("HeatlhAdvisor")]
        return Farm(_FarmHolder, _HeatlhAdvisor)

@dataclass
class HealthApplicator:
    HAp_Id: str
    Description: str
    ROMA_Code: str
    Adquisition_Date: str
    Last_Inspection_Date: str
    IROMA_Code: str

    @staticmethod
    def from_dict(obj: Any) -> 'HeatlhApplicator':
        _HAp_Id = str(obj.get("HAp_Id"))
        _Description = str(obj.get("Description"))
        _ROMA_Code = str(obj.get("ROMA_Code"))
        _Adquisition_Date = str(obj.get("Adquisition_Date"))
        _Last_Inspection_Date = str(obj.get("Last_Inspection_Date"))
        _IROMA_Code = str(obj.get("IROMA_Code"))
        return HealthApplicator(_HAp_Id, _Description, _ROMA_Code, _Adquisition_Date, _Last_Inspection_Date, _IROMA_Code)

@dataclass
class Phytosanitary:
    Registration_Number: str
    Commercial_Name: str

    @staticmethod
    def from_dict(obj: Any) -> 'Phytosanitary':
        _Registration_Number = str(obj.get("Registration_Number"))
        _Commercial_Name = str(obj.get("Commercial_Name"))
        return Phytosanitary(_Registration_Number, _Commercial_Name)

@dataclass
class PhytosanitaryAction:
    Parcel_Id: str
    Crop: Crop
    Date: str
    Problem: str
    Area: str
    HAd_Id: str
    HAp_Id: str
    Phytosanitary: Phytosanitary
    Dosage: str
    Efficacy: str

    @staticmethod
    def from_dict(obj: Any) -> 'PhytosanitaryAction':
        _Parcel_Id = str(obj.get("Parcel_Id"))
        _Crop = Crop.from_dict(obj.get("Crop"))
        _Date = str(obj.get("Date"))
        _Problem = str(obj.get("Problem"))
        _Area = str(obj.get("Area"))
        _HAd_Id = str(obj.get("HAd_Id"))
        _HAp_Id = str(obj.get("HAp_Id"))
        _Phytosanitary = Phytosanitary.from_dict(obj.get("Phytosanitary"))
        _Dosage = str(obj.get("Dosage"))
        _Efficacy = str(obj.get("Efficacy"))
        return PhytosanitaryAction(_Parcel_Id, _Crop, _Date, _Problem, _Area, _HAd_Id, _HAp_Id, _Phytosanitary, _Dosage, _Efficacy)

@dataclass
class Pistachio:
    Farm: Farm
    HealthApplicator: List[HealthApplicator]
    Exploitation_Parcel: List[ExploitationParcel]
    Phytosanitary_Action: List[PhytosanitaryAction]

    @staticmethod
    def from_dict(obj: Any) -> 'Pistachio':
        _Farm = Farm.from_dict(obj.get("Farm"))
        _HealthApplicator = [HealthApplicator.from_dict(y) for y in obj.get("HeatlhApplicator")]
        _Exploitation_Parcel = [ExploitationParcel.from_dict(y) for y in obj.get("Exploitation Parcel")]
        _Phytosanitary_Action = [PhytosanitaryAction.from_dict(y) for y in obj.get("Phytosanitary_Action")]
        return Pistachio(_Farm, _HealthApplicator, _Exploitation_Parcel, _Phytosanitary_Action)

# Example Usage
# jsonstring = json.loads(myjsonstring)
# root = Root.from_dict(jsonstring)
