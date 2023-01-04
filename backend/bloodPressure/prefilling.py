from imutils.perspective import four_point_transform
import cv2
import imutils
import numpy as np
import skimage.filters as filters
from collections import defaultdict


DIGITS_LOOKUP = {
    (1, 1, 1, 0, 1, 1, 1): 0,
    (0, 0, 1, 0, 0, 1, 0): 1,
    (1, 0, 1, 1, 1, 1, 0): 2,
    (1, 0, 1, 1, 0, 1, 1): 3,
    (0, 1, 1, 1, 0, 1, 0): 4,
    (1, 1, 0, 1, 0, 1, 1): 5,
    (1, 1, 0, 1, 1, 1, 1): 6,
    (1, 0, 1, 0, 0, 1, 0): 7,
    (1, 1, 1, 1, 1, 1, 1): 8,
    (1, 1, 1, 1, 0, 1, 1): 9,
}


def findDisplayContour(gray_image):
    # Use Canny to detect edge
    blurred_image = cv2.GaussianBlur(gray_image, (5, 5), 0)
    edged_image = cv2.Canny(blurred_image, 50, 200, 255)

    contours = cv2.findContours(
        edged_image.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
    )
    contours = imutils.grab_contours(contours)
    contours = sorted(contours, key=cv2.contourArea, reverse=True)

    # loop over the contours
    for contour in contours:
        # approximate the contour
        peri = cv2.arcLength(contour, True)
        approx = cv2.approxPolyDP(contour, 0.02 * peri, True)
        # if the contour has four vertices, then we have found
        # the thermostat display
        if len(approx) == 4:
            return approx
    raise Exception("No Display Found")


def equalizeImage(image):
    equalized_hist_image = cv2.equalizeHist(image)
    clahe_filter = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    clahed_image = clahe_filter.apply(equalized_hist_image)
    return clahed_image


def filterShadow(image):
    blurred = cv2.GaussianBlur(image, (95, 95), 0)

    division = cv2.divide(image, blurred, scale=255)

    # sharpen using unsharp masking
    sharped = filters.unsharp_mask(
        division, radius=1.5, amount=1.5, multichannel=False, preserve_range=False
    )
    sharped = (255 * sharped).clip(0, 255).astype(np.uint8)

    return sharped


def findDigitContour(image, color_display):
    contours = cv2.findContours(
        image.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
    )
    contours = imutils.grab_contours(contours)
    bounding_boxes = [cv2.boundingRect(contour) for contour in contours]

    # x[3] mean height
    threshold_height = max(bounding_boxes, key=lambda x: x[3])[3] * 0.5
    digit_contours = []
    (display_H, display_W) = image.shape
    for contour in contours:
        # compute the bounding box of the contour
        (x, y, w, h) = cv2.boundingRect(contour)
        # if the contour is located in the center and the Height is half of the largest
        if (
            (display_W * 0.1 <= x <= display_W * 0.9)
            and (display_H * 0.1 <= y <= display_H * 0.8)
            and h >= threshold_height
        ):
            cv2.rectangle(color_display, (x, y), (x + w, y + h), (0, 255, 0), 2)
            digit_contours.append(contour)

    return digit_contours


def computeOnSegment(gray_display, contour):
    # Compute the segments for 7 display
    (x, y, w, h) = cv2.boundingRect(contour)
    roi = gray_display[y : y + h, x : x + w]
    (roiH, roiW) = roi.shape
    (dW, dH) = (int(roiW * 0.25), int(roiH * 0.15))
    dHC = int(roiH * 0.05)
    # Define the set of 7 segments
    segments = [
        ((0, 0), (w, dH)),  # top
        ((0, 0), (dW, h // 2)),  # top-left
        ((w - dW, 0), (w, h // 2)),  # top-right
        ((0, (h // 2) - dHC), (w, (h // 2) + dHC)),  # center
        ((0, h // 2), (dW, h)),  # bottom-left
        ((w - dW, h // 2), (w, h)),  # bottom-right
        ((0, h - dH), (w, h)),  # bottom
    ]
    on = [0] * len(segments)
    for (i, ((xA, yA), (xB, yB))) in enumerate(segments):
        # Extract the segment ROI, count the total number of
        segROI = roi[yA:yB, xA:xB]
        # Compute the area
        total = cv2.countNonZero(segROI)
        area = (xB - xA) * (yB - yA)
        if area == 0:
            continue
        # If the total number of non-zero pixels is greater than
        # 60% of the area, mark the segment as "on"
        if total / float(area) > 0.6:
            on[i] = 1
    return on


def convertContours2Digits(digit_contours, gray_display):
    digits = []
    for contour in digit_contours:
        # Extract the digit ROI
        (x, y, w, h) = cv2.boundingRect(contour)

        # If width and height ratio is too small, assume it is a 1
        if w / h < 0.3:
            digits.append(1)
            continue
        on = computeOnSegment(gray_display, contour)
        # Find the digit with On segment tuple
        digit = DIGITS_LOOKUP.get(tuple(on), -1)
        if digit > -1:
            digits.append(digit)
    return digits


def convertDigitsToBloodPressureRecord(digits, labels, centers):
    # Group the digit with label
    group_dict = defaultdict(str)
    for label, digit in zip(labels.flatten(), digits):
        group_dict[label] += str(digit)

    # Determine which one is high, low, pulse by cluster y
    name_list = ["systolic_pressure", "diastolic_pressure", "pulse"]

    y_center = [center[1] for center in centers]

    combined_y_group_dict = sorted(zip(y_center, sorted(group_dict.items())))
    sorted_y_group_dict = [x[1][1] for x in combined_y_group_dict]
    result = {}
    # Map the number with the name
    while name_list and sorted_y_group_dict:
        name = name_list.pop(0)
        result[name] = sorted_y_group_dict.pop(0)
    # Set None
    while name_list:
        name = name_list.pop(0)
        result[name] = None
    return result



def convertImage2BloodPressureRecord(image):
    # Upsample Image
    image = imutils.resize(image, height=1000)
    # Convert to grayscale Image
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    # Find LCD display ROI
    display_contour = findDisplayContour(gray_image)
    # Fix the view angle to top view
    gray_display = four_point_transform(gray_image, display_contour.reshape(4, 2))
    display = four_point_transform(image, display_contour.reshape(4, 2))
    # Balance brightness and contrast
    gray_display = equalizeImage(gray_display)
    # Filter shadow
    gray_display = filterShadow(gray_display)
    # Thresholding and dilation to sharpen feature
    gray_display = cv2.threshold(
        gray_display, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU
    )[1]
    kernel = np.ones((3, 3), np.uint8)
    gray_display = cv2.dilate(gray_display, kernel, iterations=1)
    # Find digit contours
    digit_contours = findDigitContour(gray_display, display)
    # Sort that by y then x
    digit_contours = sorted(
        digit_contours, key=lambda c: (cv2.boundingRect(c)[1], cv2.boundingRect(c)[0])
    )
    # Group digit contours with K mean Clustering
    digit_bounding_boxes = np.float32(
        [cv2.boundingRect(contour) for contour in digit_contours]
    )
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 10, 1.0)
    _, labels, centers = cv2.kmeans(
        digit_bounding_boxes, 3, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS
    )
    # Convert Contour to digit
    digits = convertContours2Digits(digit_contours, gray_display)
    # Group digits by K mean result
    result = convertDigitsToBloodPressureRecord(digits, labels, centers)
    return result
