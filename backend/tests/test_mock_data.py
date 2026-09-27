from app.services.mock_data_generator import (
    get_demo_watershed_data,
    get_demo_sensors_data,
    generate_synthetic_time_series,
)


def test_mock_watershed_structure():
    ws = get_demo_watershed_data()
    assert ws["name"] == "Kabini River Sub-basin (Upper Cauvery)"
    assert ws["metadata_json"]["synthetic_demo_data"] is True


def test_mock_sensors_structure():
    sensors = get_demo_sensors_data(watershed_id=1)
    assert len(sensors) == 5
    for s in sensors:
        assert s["metadata_json"]["synthetic_demo_data"] is True
        assert "latitude" in s and "longitude" in s


def test_mock_time_series_provenance():
    series = generate_synthetic_time_series(days=10)
    assert len(series) == 10
    for state in series:
        assert state["provenance"]["synthetic_demo_data"] is True
        assert 0.0 <= state["ndvi"] <= 1.0
        assert 0.0 <= state["overall_confidence"] <= 1.0
