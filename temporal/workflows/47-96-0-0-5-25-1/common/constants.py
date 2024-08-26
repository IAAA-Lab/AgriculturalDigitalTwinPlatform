import os
from enum import Enum


# --- Data lake storage zones ---
class Constants(Enum):
    STORAGE_LANDING_ZONE = "landing-zone"
    STORAGE_TRUSTED_ZONE = "trusted-zone"
    STORAGE_REFINED_ZONE = "refined-zone"
    # --- Metadata tags ---
    METADATA_PARCELS_AND_TREATMENTS = "parcels_and_treatments"
    METADATA_PARCELS_AND_TREATMENTS_TREATMENTS = "parcels_and_treatments_treatments"
    METADATA_PARCELS_AND_TREATMENTS_PARCELS = "parcels_and_treatments_parcels"
    METADATA_ACTIVITIES = "activities"
    # --- Prefect tags ---
    PREFECT_NDVI_TAG = "ndvi_extract"
