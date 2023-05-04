import os
from enum import Enum


# --- Data lake storage zones ---
class Constants(Enum):
    STORAGE_LANDING_ZONE = os.environ.get("STORAGE_LANDING_ZONE")
    STORAGE_TRUSTED_ZONE = os.environ.get("STORAGE_TRUSTED_ZONE")
    STORAGE_REFINED_ZONE = os.environ.get("STORAGE_REFINED_ZONE")
    # --- Metadata tags ---
    LANDING_ZONE_METADATA_PARCELS_AND_TREATMENTS = "parcels_and_treatments"
    TRUSTED_ZONE_METADATA_PARCELS_AND_TREATMENTS_TREATMENTS = "parcels_and_treatments_treatments"
    TRUSTED_ZONE_METADATA_PARCELS_AND_TREATMENTS_PARCELS = "parcels_and_treatments_parcels"
