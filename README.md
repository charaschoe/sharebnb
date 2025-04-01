# ShareBnB Data Visualization

A critical data visualization project examining the impact of Airbnb on housing markets in major cities. This project was developed at HfG Schwäbisch Gmünd IG3 under the guidance of Jonas Wienberg, Marlon Mutlu, and Philipp Maginot.

## Project Overview

ShareBnB is an interactive data visualization that explores how short-term rentals are reshaping urban housing markets. By analyzing data from New York, Tokyo, and Paris, the project reveals the complex relationship between Airbnb listings and housing affordability.

### Design Philosophy

The visualization employs a minimalist, data-driven design approach that emphasizes:
- Clear hierarchy of information
- Intuitive navigation between cities
- Interactive elements that encourage exploration
- Responsive design that works across devices
- Accessible color schemes and typography

### Technical Features

- **Modern Web Technologies**:
  - HTML5, CSS3, and ES6+ JavaScript
  - D3.js v7 for data visualization
  - Modular JavaScript architecture
  - Responsive SVG graphics
  - CSS Grid and Flexbox layouts

- **Security Features**:
  - Content Security Policy (CSP)
  - XSS protection
  - Input sanitization
  - Secure DOM manipulation
  - Error handling

- **Interactive Elements**:
  - Dynamic data loading
  - Hover effects and tooltips
  - Responsive charts and graphs
  - Tab-based navigation
  - Real-time data updates

## Project Structure

```
sharebnb/
├── css/                 # Stylesheets
│   ├── reset.css       # CSS reset
│   ├── layout.css      # Main layout styles
│   ├── tabs.css        # Tab navigation styles
│   └── [city].css      # City-specific styles
├── js/                  # JavaScript modules
│   ├── script.js       # Main application logic
│   ├── circle.js       # Circle visualization
│   ├── barchart.js     # Bar chart visualization
│   └── [city].js       # City-specific scripts
├── data/               # Data files
│   ├── population.js   # Population statistics
│   ├── apartments.js   # Apartment data
│   └── [city].json     # City-specific data
└── index.html          # Main HTML file
```

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari)
- Basic understanding of web technologies
- Local development server (recommended)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sharebnb.git
   ```

2. Set up a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   ```

3. Open `http://localhost:8000` in your browser

### Development Guidelines

1. **Code Style**:
   - Use ES6+ features
   - Follow modular architecture
   - Implement error handling
   - Document complex functions

2. **Design Principles**:
   - Maintain consistent spacing
   - Use the provided color palette
   - Follow accessibility guidelines
   - Test responsive behavior

3. **Performance**:
   - Optimize data loading
   - Minimize DOM operations
   - Use efficient D3.js patterns
   - Implement lazy loading

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Credits

- **Project Lead**: Dr. Franklin Hernández Castro
- **Course**: Data Visualization, HfG Schwäbisch Gmünd IG3
- **Supervisors**: Jonas Wienberg, Marlon Mutlu, Philipp Maginot
- **Data Sources**: Airbnb, City Statistics
- **Technologies**: D3.js, HTML5, CSS3, JavaScript

## License

This project is licensed under the MIT License - see the LICENSE file for details.
