import pytest
from app.services.weather_service import weather_service


def test_heat_index_calculation_normal():
    # 25C and 50% humidity
    hi = weather_service.calculate_heat_index(25.0, 50.0)
    assert hi >= 24.0 and hi <= 27.0


def test_heat_index_calculation_extreme():
    # 39.4C and 68% humidity (Kolkata heatwave scenario)
    hi = weather_service.calculate_heat_index(39.4, 68.0)
    assert hi >= 50.0  # Must be extreme danger (>50C)


def test_wbgt_estimation():
    # 39.4C, 68% RH, moderate wind
    wbgt = weather_service.calculate_estimated_wbgt(39.4, 68.0, 14.0, 850.0)
    assert wbgt >= 31.0 and wbgt <= 37.0


def test_dew_point():
    dp = weather_service.calculate_dew_point(39.4, 68.0)
    assert dp >= 30.0 and dp <= 34.0


@pytest.mark.asyncio
async def test_get_observations_structure():
    obs = await weather_service.get_observations(22.5726, 88.3639)
    assert obs.temperature_c > 0.0
    assert obs.relative_humidity_pct >= 0.0 and obs.relative_humidity_pct <= 100.0
    assert obs.heat_index_c >= obs.temperature_c or obs.temperature_c < 27.0
    assert obs.source is not None
    assert obs.quality_score >= 80
