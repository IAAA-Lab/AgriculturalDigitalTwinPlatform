import os
from enum import Enum


# --- Data lake storage zones ---
class Constants(Enum):
    STORAGE_LANDING_ZONE = os.environ.get("STORAGE_LANDING_ZONE")
    STORAGE_TRUSTED_ZONE = os.environ.get("STORAGE_TRUSTED_ZONE")
    STORAGE_REFINED_ZONE = os.environ.get("STORAGE_REFINED_ZONE")
    # --- Metadata tags ---
    METADATA_PARCELS_AND_TREATMENTS = "parcels_and_treatments"
    METADATA_PARCELS_AND_TREATMENTS_TREATMENTS = "parcels_and_treatments_treatments"
    METADATA_PARCELS_AND_TREATMENTS_PARCELS = "parcels_and_treatments_parcels"
    METADATA_ACTIVITIES = "activities"
    # --- Prefect tags ---
    PREFECT_NDVI_TAG = "ndvi_extract"
