def test_list_watersheds(client):
    response = client.get("/api/v1/watersheds")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    ws = data[0]
    assert ws["code"] == "KABINI-SUBBASIN-01"
    assert ws["area_sqkm"] > 0
    assert "coordinates" in ws["boundary_geojson"]


def test_get_watershed_detail(client):
    response = client.get("/api/v1/watersheds/1")
    assert response.status_code == 200
    ws = response.json()
    assert ws["id"] == 1
    assert "Kabini" in ws["name"]
