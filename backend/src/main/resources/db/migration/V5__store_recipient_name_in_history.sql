ALTER TABLE recommendation_history
    ADD COLUMN recipient_name VARCHAR(100) NULL AFTER profile_id;

UPDATE recommendation_history rh
JOIN recipient_profiles rp ON rp.profile_id = rh.profile_id
SET rh.recipient_name = rp.full_name
WHERE rh.recipient_name IS NULL;

