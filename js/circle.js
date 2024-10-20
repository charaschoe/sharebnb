export function initializeParisCircles(data) {
	const canvas = document.getElementById("canvas");
	const ctx = canvas.getContext("2d");
	const slider = document.getElementById("slider");
	const sliderValueDisplay = document.getElementById("slider-value");

	const maxRadius = 120;

	let currentAvailableRadius = 0;
	let currentNonAvailableRadius = 0;
	let targetAvailableRadius = 0;
	let targetNonAvailableRadius = 0;
	const animationDuration = 500;
	let animationStartTime = null;

	function adjustCanvasSize() {
		const dpr = window.devicePixelRatio || 1;
		const rect = canvas.getBoundingClientRect();
		canvas.width = rect.width * dpr;
		canvas.height = rect.height * dpr;
		ctx.scale(dpr, dpr);
	}

	function calculateAverages(minimumNights) {
		const filteredData = data.filter(
			(airbnb) => airbnb.minimum_nights === minimumNights
		);

		if (filteredData.length === 0) {
			return { availablePercentage: 0, nonAvailablePercentage: 0 };
		}

		let totalAvailable = 0;
		let totalNonAvailable = 0;

		filteredData.forEach((airbnb) => {
			totalAvailable += airbnb.availability_365;
			totalNonAvailable += 365 - airbnb.availability_365;
		});

		const averageAvailable = totalAvailable / filteredData.length;
		const availablePercentage = Math.round((averageAvailable / 365) * 100);
		const nonAvailablePercentage = 100 - availablePercentage;

		return { availablePercentage, nonAvailablePercentage };
	}

	function updateCircles() {
		adjustCanvasSize();
		const minimumNights = parseInt(slider.value, 10);
		const { availablePercentage, nonAvailablePercentage } =
			calculateAverages(minimumNights);

		targetAvailableRadius = (availablePercentage / 100) * maxRadius;
		targetNonAvailableRadius = (nonAvailablePercentage / 100) * maxRadius;

		animationStartTime = null;
		requestAnimationFrame(animateCircles);

		sliderValueDisplay.innerText = `Amount of minimum nights: ${minimumNights}`;
	}

	function animateCircles(timestamp) {
		if (!animationStartTime) animationStartTime = timestamp;
		const elapsed = timestamp - animationStartTime;
		const progress = Math.min(elapsed / animationDuration, 1);

		currentAvailableRadius =
			currentAvailableRadius +
			(targetAvailableRadius - currentAvailableRadius) * progress;
		currentNonAvailableRadius =
			currentNonAvailableRadius +
			(targetNonAvailableRadius - currentNonAvailableRadius) * progress;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		drawLabel("Available", 200, 20);
		drawLabel("Not Available", 400, 20);

		drawCircle(
			200,
			150,
			currentAvailableRadius,
			Math.round((currentAvailableRadius / maxRadius) * 100)
		);
		drawCircle(
			400,
			150,
			currentNonAvailableRadius,
			Math.round((currentNonAvailableRadius / maxRadius) * 100)
		);

		if (progress < 1) {
			requestAnimationFrame(animateCircles);
		}
	}

	function drawCircle(x, y, radius, percentage) {
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
		ctx.fillStyle = "#ffffff";
		ctx.fill();

		const fontSize = 30;
		const text = percentage + "%";

		ctx.font = `bold ${fontSize}px Inter`;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStyle = "#ffffff";
		ctx.fillText(text, x, y);

		ctx.save();
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2 * Math.PI);
		ctx.clip();
		ctx.fillStyle = "#96bcab";
		ctx.fillText(text, x, y);
		ctx.restore();
	}

	function drawLabel(text, x, y) {
		ctx.font = "16px Inter";
		ctx.textAlign = "center";
		ctx.textBaseline = "bottom";
		ctx.fillStyle = "#ffffff";
		ctx.fillText(text, x, y);
	}

	function initializeCanvas() {
		const dpr = window.devicePixelRatio || 1;
		canvas.style.width = "600px";
		canvas.style.height = "400px";
		canvas.width = 600 * dpr;
		canvas.height = 100 * dpr;
		ctx.scale(dpr, dpr);
	}

	slider.addEventListener("input", updateCircles);

	initializeCanvas();
}
