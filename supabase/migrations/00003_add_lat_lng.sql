-- Add latitude and longitude to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_lat FLOAT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_lng FLOAT;

-- Create a function to find nearby users using the Haversine formula
-- Returns distance in miles.
CREATE OR REPLACE FUNCTION public.nearby_users(
    p_home_city TEXT,
    p_lat FLOAT,
    p_lng FLOAT,
    p_radius_miles FLOAT
)
RETURNS TABLE (
    id UUID,
    pseudonym TEXT,
    status TEXT,
    home_city TEXT,
    current_city TEXT,
    distance FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.pseudonym,
        p.status,
        p.home_city,
        p.current_city,
        (
            3958.8 * acos(
                -- Handle edge case where points are exactly identical to avoid acos(>1) domain error
                LEAST(1.0, cos(radians(p_lat)) * cos(radians(p.current_lat)) * 
                cos(radians(p.current_lng) - radians(p_lng)) + 
                sin(radians(p_lat)) * sin(radians(p.current_lat)))
            )
        ) AS distance
    FROM public.profiles p
    WHERE p.home_city = p_home_city
    AND p.current_lat IS NOT NULL
    AND p.current_lng IS NOT NULL
    AND p.id != auth.uid() -- Exclude the searching user
    AND (
        3958.8 * acos(
            LEAST(1.0, cos(radians(p_lat)) * cos(radians(p.current_lat)) * 
            cos(radians(p.current_lng) - radians(p_lng)) + 
            sin(radians(p_lat)) * sin(radians(p.current_lat)))
        )
    ) <= p_radius_miles
    ORDER BY distance ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
