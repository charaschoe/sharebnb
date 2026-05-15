function loadParisData() {
	if (!window.parisDataPromise) {
		window.parisDataPromise = fetch("data/paris.json").then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return response.json();
		});
	}

	return window.parisDataPromise;
}

function getListingsForThreshold(data, threshold) {
	return data.filter((listing) => {
		const minimumNights = Number(listing.minimum_nights) || 0;
		return minimumNights > 0 && minimumNights <= threshold;
	});
}

function drawAvailabilityDots(canvas, data, threshold) {
	const context = canvas.getContext("2d");
	const frame = canvas.closest(".viz-frame") || canvas.parentElement;
	const rect = frame ? frame.getBoundingClientRect() : canvas.getBoundingClientRect();
	const width = Math.floor(rect.width);
	const height = Math.floor(rect.height);

	if (!width || !height) {
		return null;
	}

	const ratio = window.devicePixelRatio || 1;
	canvas.width = width * ratio;
	canvas.height = height * ratio;
	canvas.style.width = `${width}px`;
	canvas.style.height = `${height}px`;
	context.setTransform(ratio, 0, 0, ratio, 0, 0);
	context.clearRect(0, 0, width, height);

	const sampleSize = 360;
	const sample = data.slice(0, sampleSize);
	const available = new Set(getListingsForThreshold(sample, threshold));
	const columns = width < 360 ? 24 : 30;
	const rows = Math.ceil(sample.length / columns);
	const gap = Math.min(width / columns, height / rows);
	const radius = Math.max(2.5, gap * 0.28);
	const offsetX = (width - (columns - 1) * gap) / 2;
	const offsetY = Math.max(radius + 2, (height - (rows - 1) * gap) / 2);

	sample.forEach((listing, index) => {
		const x = offsetX + (index % columns) * gap;
		const y = offsetY + Math.floor(index / columns) * gap;
		context.beginPath();
		context.arc(x, y, radius, 0, Math.PI * 2);
		context.fillStyle = available.has(listing)
			? "rgba(255, 255, 255, 0.92)"
			: "rgba(255, 255, 255, 0.2)";
		context.fill();
	});

	return getListingsForThreshold(data, threshold).length;
}

async function initializeParisAvailability() {
	try {
		const canvas = document.getElementById("canvas");
		const slider = document.getElementById("slider");
		const sliderValue = document.getElementById("slider-value");
		if (!canvas || !slider || !sliderValue) return;

		const data = await loadParisData();
		let renderFrame = null;

		function render() {
			const threshold = Number(slider.value);
			const count = drawAvailabilityDots(canvas, data, threshold);
			if (count === null) return;
			sliderValue.textContent = `Minimum Nights: ${threshold} | ${count.toLocaleString(
				"de-DE"
			)} listings available`;
		}

		function scheduleRender() {
			if (renderFrame) cancelAnimationFrame(renderFrame);
			renderFrame = requestAnimationFrame(() => {
				renderFrame = null;
				render();
			});
		}

		slider.addEventListener("input", render);
		window.addEventListener("resize", scheduleRender);

		const frame = canvas.closest(".viz-frame");
		if (frame && "ResizeObserver" in window) {
			const observer = new ResizeObserver(scheduleRender);
			observer.observe(frame);
		}

		document.querySelectorAll(".container label").forEach((label) => {
			label.addEventListener("mouseenter", scheduleRender);
			label.addEventListener("transitionend", scheduleRender);
		});

		scheduleRender();
	} catch (error) {
		console.error("Error initializing Paris availability:", error);
	}
}

document.addEventListener("DOMContentLoaded", initializeParisAvailability);
