/**
 * Temple Poster Canvas Renderer - Aal Parivar Madh (Bhechada)
 * Unique Devotional Symmetrical Arch Layout with Classic Yellow & Teal Palette
 * High Resolution: 1080 x 1760 px
 */

class PosterRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.width = 1080;
    this.height = 1760;
    this.imageCache = new Map();
  }

  /**
   * Helper to load an image with caching
   */
  loadImage(src) {
    if (!src) return Promise.resolve(null);
    if (this.imageCache.has(src)) {
      return Promise.resolve(this.imageCache.get(src));
    }
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.imageCache.set(src, img);
        resolve(img);
      };
      img.onerror = () => {
        console.warn('Failed to load image:', src.substring(0, 50));
        resolve(null);
      };
      img.src = src;
    });
  }

  /**
   * Cross-browser rounded rectangle
   */
  roundRect(x, y, w, h, radius) {
    const ctx = this.ctx;
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, radius);
      return;
    }
    const r = typeof radius === 'number' ? radius : 8;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  /**
   * Draw sacred decorative mandala
   */
  drawMandala(cx, cy, radius) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 1.8;

    const petals = 18;
    for (let i = 0; i < petals; i++) {
      ctx.beginPath();
      ctx.ellipse(0, 0, radius * 0.2, radius * 0.72, (i * Math.PI) / (petals / 2), 0, Math.PI * 2);
      ctx.stroke();
    }

    // Concentric dashed rings
    for (let r = radius * 0.3; r <= radius; r += radius * 0.25) {
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.setLineDash([8, 12]);
      ctx.stroke();
    }
    ctx.restore();
  }

  /**
   * Main Render Routine
   */
  async render(data) {
    const ctx = this.ctx;
    const W = this.width;
    const H = this.height;

    this.canvas.width = W;
    this.canvas.height = H;

    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    // 1. Top Radiant Golden-Yellow Background (Same beloved colors)
    ctx.save();
    const goldGrad = ctx.createRadialGradient(W / 2, 380, 50, W / 2, 450, 850);
    goldGrad.addColorStop(0, '#fffbe6');
    goldGrad.addColorStop(0.22, '#fee557');
    goldGrad.addColorStop(0.62, '#f7b928');
    goldGrad.addColorStop(1, '#e5900c');
    ctx.fillStyle = goldGrad;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();

    // 2. Auspicious Mandala Background Pattern
    this.drawMandala(W / 2, 390, 480);

    // 3. Bottom Deep Teal Section - SYMMETRICAL TEMPLE ARCH (No diagonal slant!)
    ctx.save();
    const archSideY = 785;
    const archPeakY = 715;

    ctx.beginPath();
    ctx.moveTo(0, archSideY);
    ctx.bezierCurveTo(
      W * 0.22, archPeakY,
      W * 0.78, archPeakY,
      W, archSideY
    );
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();

    const tealGrad = ctx.createRadialGradient(W / 2, H * 0.76, 100, W / 2, H * 0.76, W * 0.88);
    tealGrad.addColorStop(0, '#0c5c6c');
    tealGrad.addColorStop(0.42, '#084855');
    tealGrad.addColorStop(0.82, '#05313a');
    tealGrad.addColorStop(1, '#032026');
    ctx.fillStyle = tealGrad;
    ctx.fill();

    // Dual Gold & White highlight trim along the arch
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // 4. Delicate Perimeter Frame (Gives clean memento finish)
    ctx.save();
    const pad = 24;
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
    ctx.lineWidth = 1.8;
    ctx.strokeRect(pad, pad, W - pad * 2, H - pad * 2);
    const drawCorner = (cx, cy) => {
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();
    };
    drawCorner(pad, pad);
    drawCorner(W - pad, pad);
    drawCorner(W - pad, H - pad);
    drawCorner(pad, H - pad);
    ctx.restore();

    // 5. Top Deities Header - 4 Sacred Names across the top
    ctx.save();
    const deityList = (data.deityNames && data.deityNames.length) ? data.deityNames : [
      'જય લીંબોજ માં',
      'જય મોમાઈ માં',
      'જય મેલડી માં',
      'જય ગોગા મહારાજ'
    ];

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#6e1d0c'; // Devotional Sacred Maroon
    ctx.font = '700 27px "Hind Vadodara", "Noto Sans Gujarati", sans-serif';

    if (deityList.length === 4) {
      const coordsX = [W * 0.17, W * 0.39, W * 0.63, W * 0.85];
      deityList.forEach((name, i) => {
        ctx.fillText(name, coordsX[i], 82);
      });
    } else {
      const step = W / (deityList.length + 1);
      deityList.forEach((name, i) => {
        ctx.fillText(name, step * (i + 1), 82);
      });
    }

    // Tagline: "શ્રદ્ધા, સેવા અને સંગઠન"
    if (data.tagline) {
      ctx.textAlign = 'center';
      ctx.fillStyle = '#0a3c48'; // Rich deep teal
      ctx.font = '700 37px "Hind Vadodara", "Noto Sans Gujarati", sans-serif';
      ctx.fillText(`❖  ${data.tagline}  ❖`, W / 2, 142);
    }
    ctx.restore();

    // 6. Hero Madh / Temple Photo
    const templeImg = await this.loadImage(data.templeUrl || DEFAULT_ASSETS.temple);
    const templeW = 560;
    const templeH = 430;
    const templeX = (W - templeW) / 2;
    const templeY = 195;
    const templeBorder = 10;
    const templeRadius = 20;

    // Drop Shadow & White Outer Frame
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.32)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 10;
    ctx.fillStyle = '#ffffff';
    this.roundRect(templeX, templeY, templeW, templeH, templeRadius);
    ctx.fill();
    ctx.restore();

    // Inner Image with Cover Fit
    if (templeImg) {
      ctx.save();
      const innerW = templeW - templeBorder * 2;
      const innerH = templeH - templeBorder * 2;
      this.roundRect(templeX + templeBorder, templeY + templeBorder, innerW, innerH, templeRadius - 4);
      ctx.clip();

      const imgRatio = templeImg.width / templeImg.height;
      const frameRatio = innerW / innerH;
      let dW, dH;
      if (imgRatio > frameRatio) {
        dH = innerH;
        dW = dH * imgRatio;
      } else {
        dW = innerW;
        dH = dW / imgRatio;
      }
      const oX = (templeX + templeBorder) + (innerW - dW) / 2;
      const oY = (templeY + templeBorder) + (innerH - dH) / 2;
      ctx.drawImage(templeImg, oX, oY, dW, dH);
      ctx.restore();
    }

    // Gold Rim around temple photo
    ctx.save();
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    this.roundRect(templeX + 9, templeY + 9, templeW - 18, templeH - 18, templeRadius - 3);
    ctx.stroke();
    ctx.restore();

    // 7. Village Heritage Details
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#06424e';
    ctx.font = '800 44px "Hind Vadodara", "Noto Sans Gujarati", sans-serif';
    ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
    ctx.shadowBlur = 8;
    ctx.fillText(`— ❖ ${data.villageLine || 'ગામ : ભેચડા'} ❖ —`, W / 2, 666);
    ctx.restore();

    // 8. Event Badge (Crowned on top of the teal arch)
    const badgeW = 470;
    const badgeH = 74;
    const badgeX = (W - badgeW) / 2;
    const badgeY = 724;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 6;

    const badgeGrad = ctx.createLinearGradient(badgeX, badgeY, badgeX + badgeW, badgeY + badgeH);
    badgeGrad.addColorStop(0, '#093a44');
    badgeGrad.addColorStop(0.5, '#0e5b6b');
    badgeGrad.addColorStop(1, '#072e36');
    ctx.fillStyle = badgeGrad;

    this.roundRect(badgeX, badgeY, badgeW, badgeH, badgeH / 2);
    ctx.fill();

    // Golden inner border
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Event Text
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '800 38px "Hind Vadodara", "Noto Sans Gujarati", sans-serif';
    ctx.fillText(data.eventName || 'જન્મદિવસ નિમિત્તે', W / 2, badgeY + badgeH / 2 + 1);
    ctx.restore();

    // 9. Donor Photo Box
    const photoW = 460;
    const photoH = 375;
    const photoX = (W - photoW) / 2;
    const photoY = 832;
    const photoRadius = 26;

    // Outer White Frame with Shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 26;
    ctx.shadowOffsetY = 12;
    ctx.fillStyle = '#ffffff';
    this.roundRect(photoX, photoY, photoW, photoH, photoRadius);
    ctx.fill();
    ctx.restore();

    // Gold inner trim
    ctx.save();
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    this.roundRect(photoX + 6, photoY + 6, photoW - 12, photoH - 12, photoRadius - 3);
    ctx.stroke();
    ctx.restore();

    // Inner Image / Placeholder
    const donorBorder = 10;
    const innerX = photoX + donorBorder;
    const innerY = photoY + donorBorder;
    const innerW = photoW - donorBorder * 2;
    const innerH = photoH - donorBorder * 2;

    ctx.save();
    this.roundRect(innerX, innerY, innerW, innerH, photoRadius - 6);
    ctx.clip();

    ctx.fillStyle = '#0f3a44';
    ctx.fillRect(innerX, innerY, innerW, innerH);

    const donorImg = data.donorPhotoUrl ? await this.loadImage(data.donorPhotoUrl) : null;
    if (donorImg) {
      const zoom = data.donorZoom || 1.0;
      const panX = data.donorPanX || 0;
      const panY = data.donorPanY || 0;

      const imgRatio = donorImg.width / donorImg.height;
      const boxRatio = innerW / innerH;
      let drawW, drawH;

      if (imgRatio > boxRatio) {
        drawH = innerH * zoom;
        drawW = drawH * imgRatio;
      } else {
        drawW = innerW * zoom;
        drawH = drawW / imgRatio;
      }

      const offsetX = innerX + (innerW - drawW) / 2 + (panX / 100) * (innerW * 0.5);
      const offsetY = innerY + (innerH - drawH) / 2 + (panY / 100) * (innerH * 0.5);
      ctx.drawImage(donorImg, offsetX, offsetY, drawW, drawH);
    } else {
      // Clean Placeholder
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '54px system-ui, sans-serif';
      ctx.fillText('📷', W / 2, innerY + innerH / 2 - 28);

      ctx.fillStyle = '#fde047';
      ctx.font = '700 28px "Hind Vadodara", "Noto Sans Gujarati", sans-serif';
      ctx.fillText('દાતાનો ફોટો અપલોડ કરો', W / 2, innerY + innerH / 2 + 32);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 20px "Hind Vadodara", "Noto Sans Gujarati", sans-serif';
      ctx.fillText('(Photo will appear here)', W / 2, innerY + innerH / 2 + 66);
    }
    ctx.restore();

    // 10. Donor Name Capsule (Dynamic Auto-fitting Pill with Gold Trim)
    ctx.save();
    const hasName = data.donorName && data.donorName.trim().length > 0;
    const displayName = hasName ? data.donorName.trim() : 'દાતાનું નામ';
    const fontWeight = hasName ? '800' : '600';

    const maxPillWidth = Math.min(880, W - 100);
    const minPillWidth = 520;
    const paddingX = 44;
    const maxTextWidth = maxPillWidth - paddingX * 2;

    let fontSize = hasName ? 42 : 38;
    const minFontSize = 24;

    ctx.font = `${fontWeight} ${fontSize}px "Hind Vadodara", "Noto Sans Gujarati", sans-serif`;
    let measuredWidth = ctx.measureText(displayName).width;

    while (measuredWidth > maxTextWidth && fontSize > minFontSize) {
      fontSize -= 1;
      ctx.font = `${fontWeight} ${fontSize}px "Hind Vadodara", "Noto Sans Gujarati", sans-serif`;
      measuredWidth = ctx.measureText(displayName).width;
    }

    const namePillW = Math.max(minPillWidth, Math.min(maxPillWidth, measuredWidth + paddingX * 2));
    const namePillH = Math.max(78, fontSize + 34);
    const namePillX = (W - namePillW) / 2;
    const namePillY = photoY + photoH - namePillH / 2;
    const pillRadius = namePillH / 2;

    // Drop Shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = '#ffffff';
    this.roundRect(namePillX, namePillY, namePillW, namePillH, pillRadius);
    ctx.fill();

    // Gold Trim on Name Pill
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Text in Dark Slate
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = hasName ? '#0f172a' : '#94a3b8';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${fontWeight} ${fontSize}px "Hind Vadodara", "Noto Sans Gujarati", sans-serif`;
    ctx.fillText(displayName, W / 2, namePillY + namePillH / 2 + 1, namePillW - paddingX);
    ctx.restore();

    // 11. Date and Amount - In an illuminated frosted plaque
    const dateY = 1360;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const dBoxW = 760;
    const dBoxH = 68;
    const dBoxX = (W - dBoxW) / 2;
    const dBoxY = dateY - dBoxH / 2;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    this.roundRect(dBoxX, dBoxY, dBoxW, dBoxH, 16);
    ctx.fill();
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.35)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    const dateStr = data.donationDate || '02-10-2026';
    const amountStr = data.donationAmount || '501';

    const fontNormal = '600 37px "Hind Vadodara", "Noto Sans Gujarati", sans-serif';
    const fontBold = '800 45px "Hind Vadodara", "Noto Sans Gujarati", sans-serif';

    const seg1 = 'તા. ';
    const seg2 = dateStr;
    const seg3 = ' ના રોજ આપેલ રૂ. ';
    const seg4 = amountStr.endsWith('/-') ? amountStr : `${amountStr}/-`;

    ctx.font = fontNormal;
    const w1 = ctx.measureText(seg1).width;
    const w3 = ctx.measureText(seg3).width;

    ctx.font = fontBold;
    const w2 = ctx.measureText(seg2).width;
    const w4 = ctx.measureText(seg4).width;

    const totalLineW = w1 + w2 + w3 + w4;
    let curX = (W - totalLineW) / 2;

    ctx.font = fontNormal;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(seg1, curX + w1 / 2, dateY);
    curX += w1;

    ctx.font = fontBold;
    ctx.fillStyle = '#fde047';
    ctx.fillText(seg2, curX + w2 / 2, dateY);
    curX += w2;

    ctx.font = fontNormal;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(seg3, curX + w3 / 2, dateY);
    curX += w3;

    // Glowing 24K Gold Amount
    ctx.font = '900 48px "Hind Vadodara", "Noto Sans Gujarati", sans-serif';
    ctx.fillStyle = '#facc15';
    ctx.shadowColor = 'rgba(250, 204, 21, 0.5)';
    ctx.shadowBlur = 14;
    ctx.fillText(seg4, curX + w4 / 2, dateY);
    ctx.restore();

    // 12. Footer Gratitude / Message Lines
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Line 1: આલ પરિવાર મઢ - ભેચડા
    ctx.fillStyle = '#bbf2fd';
    ctx.font = '700 40px "Hind Vadodara", "Noto Sans Gujarati", sans-serif';
    ctx.fillText(data.footerLine1 || 'આલ પરિવાર મઢ - ભેચડા', W / 2, 1455);

    // Line 2: Purpose appreciation
    ctx.fillStyle = '#f0fdf4';
    ctx.font = '500 34px "Hind Vadodara", "Noto Sans Gujarati", sans-serif';
    ctx.fillText(data.footerLine2 || 'મઢના વિકાસ અર્થે આપનું મૂલ્ય યોગદાન આપવા બદલ', W / 2, 1520);

    // Line 3: Deep gratitude
    ctx.fillStyle = '#67e8f9';
    ctx.font = '800 42px "Hind Vadodara", "Noto Sans Gujarati", sans-serif';
    ctx.shadowColor = 'rgba(103, 232, 249, 0.4)';
    ctx.shadowBlur = 12;
    ctx.fillText(`॥ ${data.footerLine3 || 'ખુબ ખુબ આભાર....'} ॥`, W / 2, 1590);
    ctx.restore();

    return this.canvas;
  }

  /**
   * Export canvas as Data URL
   */
  toDataURL(format = 'image/png', quality = 0.95) {
    return this.canvas.toDataURL(format, quality);
  }

  /**
   * Export canvas as Blob
   */
  toBlob(format = 'image/png', quality = 0.95) {
    return new Promise((resolve) => {
      this.canvas.toBlob((blob) => resolve(blob), format, quality);
    });
  }
}

window.PosterRenderer = PosterRenderer;
