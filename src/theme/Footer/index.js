import React from "react";

export default function Footer(props) {
  const footerColumns = [
    {
      title: "Community",
      links: [
        { label: "GitHub", href: "https://github.com/trypear/pearai-app" },
      ],
    },
  ];

  return (
    <footer className="footer">
      <div className="footer__links">
        {footerColumns.map((column, index) => (
          <div key={index} className="footer__link-column">
            <h4>{column.title}</h4>
            <ul>
              {column.links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="footer__copyright">
        Copyright © {new Date().getFullYear()} Optimum Docs
      </div>
    </footer>
  );
}
