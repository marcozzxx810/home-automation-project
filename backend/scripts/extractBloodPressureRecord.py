from imutils.perspective import four_point_transform
from imutils import contours
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

def main():
    img_name = "test2.jpeg"
    image = cv2.imread(img_name)
    image = imutils.resize(image, height=1000)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edged = cv2.Canny(blurred, 50, 200, 255)

    # cv2.imshow("test", edged)
    # cv2.waitKey(0)

    cnts = cv2.findContours(edged.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = imutils.grab_contours(cnts)
    cnts = sorted(cnts, key=cv2.contourArea, reverse=True)

    displayCnt = None
    # loop over the contours
    for c in cnts:
        # approximate the contour
        peri = cv2.arcLength(c, True)
        approx = cv2.approxPolyDP(c, 0.02 * peri, True)
        # if the contour has four vertices, then we have found
        # the thermostat display
        if len(approx) == 4:
            displayCnt = approx
            break
    warped = four_point_transform(gray, displayCnt.reshape(4, 2))
    output = four_point_transform(image, displayCnt.reshape(4, 2))

    warped = cv2.equalizeHist(warped)
    clahefilter = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    warped = clahefilter.apply(warped)

    smooth = cv2.GaussianBlur(warped, (95, 95), 0)

    division = cv2.divide(warped, smooth, scale=255)

    # sharpen using unsharp masking
    sharp = filters.unsharp_mask(
        division, radius=1.5, amount=1.5, multichannel=False, preserve_range=False
    )
    sharp = (255 * sharp).clip(0, 255).astype(np.uint8)

    thresh = cv2.threshold(sharp, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]
    #kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    kernel = np.ones((3, 3), np.uint8)
    thresh = cv2.dilate(thresh, kernel, iterations = 1)
    cv2.imshow("thresh", thresh)
    cv2.waitKey(0)
    cnts = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = imutils.grab_contours(cnts)
    boundingBoxes = [cv2.boundingRect(c) for c in cnts]

    threshold_height = max(boundingBoxes, key=lambda x: x[3])[3] * 0.5
    horizontal_line = max(boundingBoxes, key=lambda x: x[2])
    digitCnts = []
    # loop over the digit area candidates
    (warped_H, warped_W) = warped.shape
    for c in cnts:
        # compute the bounding box of the contour
        (x, y, w, h) = cv2.boundingRect(c)
        # if the contour is sufficiently large, it must be a digit
        if (
            (warped_W * 0.1 <= x <= warped_W * 0.9)
            and (warped_H * 0.1 <= y <= warped_H * 0.8)
            and h >= threshold_height
        ):
            cv2.rectangle(output, (x, y), (x + w, y + h), (0, 255, 0), 2)
            digitCnts.append(c)

    cv2.imshow("Thresh", output)
    cv2.waitKey(0)
    print(len(digitCnts))

    # digitCnts = contours.sort_contours(digitCnts, method="top-to-bottom")[0]
    digitCnts = sorted(
        digitCnts, key=lambda c: (cv2.boundingRect(c)[1], cv2.boundingRect(c)[0])
    )
    digits = []

    # group digitCnts
    Z = np.float32([cv2.boundingRect(c) for c in digitCnts])
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 10, 1.0)
    _, label, center = cv2.kmeans(Z, 3, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
    print(center)
    for c in digitCnts:
        # extract the digit ROI
        (x, y, w, h) = cv2.boundingRect(c)
        roi = thresh[y : y + h, x : x + w]
        # compute the width and height of each of the 7 segments
        # we are going to examine
        (roiH, roiW) = roi.shape
        if roiW / roiH < 0.3:
            digits.append(1)
            continue
        print(roiH, roiW)
        (dW, dH) = (int(roiW * 0.25), int(roiH * 0.15))
        dHC = int(roiH * 0.05)
        # define the set of 7 segments
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
        # loop over the segments
        for (i, ((xA, yA), (xB, yB))) in enumerate(segments):
            # extract the segment ROI, count the total number of
            # thresholded pixels in the segment, and then compute
            # the area of the segment
            segROI = roi[yA:yB, xA:xB]
            total = cv2.countNonZero(segROI)
            area = (xB - xA) * (yB - yA)
            if area == 0:
                continue
            # if the total number of non-zero pixels is greater than
            # 50% of the area, mark the segment as "on"
            if total / float(area) > 0.6:
                on[i] = 1
            # lookup the digit and draw it on the image
        cv2.imshow("Thresh", roi)
        cv2.waitKey(0)
        digit = DIGITS_LOOKUP.get(tuple(on), -1)
        print(on, digit)
        if digit > -1:
            digits.append(digit)
            cv2.rectangle(output, (x, y), (x + w, y + h), (0, 255, 0), 1)
            cv2.putText(
                output,
                str(digit),
                (x - 10, y - 10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.65,
                (0, 255, 0),
                2,
            )

    # group the digit
    group_dict = defaultdict(str)
    print(label.flatten())
    for label, digit in zip(label.flatten(), digits):
        group_dict[label] += str(digit)
    print(group_dict)

    # determine which one is high, low, pulse
    name_list = ["sys", "dia", "pulse"]
    print(center)
    y_center = [center[1] for center in center]

    combined_y_group_dict = sorted(zip(y_center, sorted(group_dict.items())))
    sorted_y_group_dict = [x[1][1] for x in combined_y_group_dict]
    ans = {}
    while name_list and sorted_y_group_dict:
        name = name_list.pop(0)
        ans[name] = sorted_y_group_dict.pop(0)
    print("ans", ans)

    cv2.imshow("Thresh", output)
    cv2.waitKey(0)


if __name__ == "__main__":
    main()
