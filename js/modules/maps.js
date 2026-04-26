/**
 * @module maps
 * @description Premium Google Maps integration with Search, Geolocation, and Visual Peak Hour Cards.
 */

let map;
let markers = [];
let userMarker;

export function initMaps(root, apiKey) {
  if (!root || !apiKey) return;
  root.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;background:#f8fafc;color:#64748b;font-family:sans-serif;">✨ Loading Premium Maps...</div>';

  if (!window.google) {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMapInstance`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    window.initMapInstance = () => renderMap(root);
  } else {
    renderMap(root);
  }
}

function renderMap(root) {
  root.innerHTML = '';
  try {
    map = new google.maps.Map(root, {
      center: { lat: 20.5937, lng: 78.9629 },
      zoom: 5,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      styles: [
        { "featureType": "poi.business", "stylers": [{ "visibility": "off" }] },
        { "featureType": "transit", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }
      ]
    });

    // Unified Control Container
    const controlUI = document.createElement("div");
    controlUI.style.cssText = "margin-top: 10px; margin-left: 10px; display: flex; gap: 8px; align-items: center;";
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(controlUI);

    // Search Box
    const input = document.createElement("input");
    input.placeholder = "🔍 Search for your polling area...";
    input.style.cssText = "padding: 12px 20px; width: 300px; border-radius: 30px; border: none; box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-family: 'Inter', sans-serif; font-size: 14px; outline: none; background: white;";
    controlUI.appendChild(input);

    // Detect My Location Button
    const locationBtn = document.createElement("button");
    locationBtn.innerHTML = "📍";
    locationBtn.title = "Use My Current Location";
    locationBtn.style.cssText = "width: 44px; height: 44px; border-radius: 50%; border: none; background: white; box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;";
    locationBtn.onmouseover = () => locationBtn.style.transform = "scale(1.1)";
    locationBtn.onmouseout = () => locationBtn.style.transform = "scale(1.0)";
    controlUI.appendChild(locationBtn);

    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;
      map.setCenter(place.geometry.location);
      map.setZoom(15);
      const pos = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };
      updateUserMarker(pos, "Searched Area");
      addMockBooths(pos);
    });

    locationBtn.addEventListener("click", () => detectUserLocation(true));

    detectUserLocation(false);
  } catch (e) {
    root.innerHTML = `<div style="padding:2rem;text-align:center;">Map Error: ${e.message}</div>`;
  }
}

function detectUserLocation(shouldZoom) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const userPos = { lat: position.coords.latitude, lng: position.coords.longitude };
      if (shouldZoom) { map.setCenter(userPos); map.setZoom(15); }
      updateUserMarker(userPos, "You are here");
      addMockBooths(userPos);
    }, (err) => {
      console.warn("Geolocation denied", err);
    });
  }
}

function updateUserMarker(pos, title) {
  if (userMarker) userMarker.setMap(null);
  userMarker = new google.maps.Marker({
    position: pos, map: map, title: title,
    icon: { path: google.maps.SymbolPath.CIRCLE, scale: 10, fillColor: "#4285F4", fillOpacity: 1, strokeWeight: 3, strokeColor: "#FFFFFF" }
  });
}

function addMockBooths(center) {
  markers.forEach(m => m.setMap(null));
  markers = [];

  const booths = [
    { name: "Global Excellence School", id: "01", lat: center.lat + 0.003, lng: center.lng + 0.003 },
    { name: "Public Community Hall", id: "45", lat: center.lat - 0.002, lng: center.lng + 0.005 },
    { name: "Central Civil Wing", id: "89", lat: center.lat + 0.004, lng: center.lng - 0.002 }
  ];

  booths.forEach(booth => {
    const marker = new google.maps.Marker({
      position: { lat: booth.lat, lng: booth.lng },
      map: map,
      title: booth.name,
      animation: google.maps.Animation.DROP,
      icon: "https://maps.google.com/mapfiles/ms/icons/orange-dot.png"
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="padding: 16px; min-width: 260px; font-family: 'Inter', sans-serif; color: #1e293b;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span style="background: #f58320; color: white; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: 800;">STATION ${booth.id}</span>
            <span style="color: #64748b; font-size: 11px;">Active Booth</span>
          </div>
          <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 700; color: #0f172a;">${booth.name}</h3>
          
          <div style="background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%); padding: 12px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-end; height: 60px; gap: 8px;">
              ${[70, 100, 45, 30, 85, 95].map((h, i) => `
                <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px;">
                  <div style="width: 100%; height: ${h/1.8}px; background: ${h > 80 ? 'linear-gradient(180deg, #f87171, #ef4444)' : h > 50 ? 'linear-gradient(180deg, #fbbf24, #f59e0b)' : 'linear-gradient(180deg, #34d399, #10b981)'}; border-radius: 4px 4px 0 0;"></div>
                  <span style="font-size: 8px; font-weight: 600; color: #94a3b8;">${7 + i*2}${7+i*2 < 12 ? 'AM' : 'PM'}</span>
                </div>
              `).join('')}
            </div>
            <div style="margin-top: 10px; display: flex; align-items: center; gap: 6px;">
              <div style="width: 8px; height: 8px; border-radius: 50%; background: #10b981;"></div>
              <span style="font-size: 11px; font-weight: 600; color: #059669;">Best Time: 1:00 PM – 3:00 PM</span>
            </div>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #f1f5f9; padding-top: 12px;">
            <div style="display: flex; align-items: center; gap: 4px;">
              <span style="font-size: 18px;">🕒</span>
              <span style="font-size: 12px; font-weight: 600;">~12 min wait</span>
            </div>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${booth.lat},${booth.lng}" target="_blank" style="background: #000058; color: white; padding: 6px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-decoration: none; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Directions ↗</a>
          </div>
        </div>
      `
    });

    marker.addListener("click", () => infoWindow.open(map, marker));
    markers.push(marker);
  });
}
