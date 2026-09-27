def test_health_endpoint(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["project_name"] == "BHŪ-TATTVA-ANVEṢA"
    assert data["app_mode"] == "development"
    assert data["data_mode"] == "mock"


def test_db_health_endpoint(client):
    response = client.get("/api/v1/health/db")
    assert response.status_code == 200
    data = response.json()
    assert "connected" in data
