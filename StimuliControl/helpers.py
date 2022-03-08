import threading
import colorsys
import math

# Assuming the max Brightness when room is 300 lux with slow and exponential grow
MAX_LUX = 300


def set_interval(func, sec):
    def func_wrapper():
        set_interval(func, sec)
        func()

    t = threading.Timer(sec, func_wrapper)
    t.start()
    return t


def adaptBright(r, g, b, lux, factor=0):
    # If lux is greater than MAX_LUX fit the factor in 100%, if lux is negative fit to 1%

    # Linear
    # (1 + 99x/MAX_LUX)/100
    f1 = ((1 + 99 * lux / MAX_LUX) / 100 if lux >= 0 else 0.01) if lux <= MAX_LUX else 1

    # Logarithmic
    # (log base (MAX_LUX^1/100) of lux)/100
    f2 = (math.log(lux, pow(MAX_LUX, 0.01)) / 100 if lux >= 0 else 0.01) if lux <= MAX_LUX else 1

    # Exponential
    # ((100^1/MAX_LUX)^lux)/100
    f3 = (pow(pow(100, (1 / MAX_LUX)), lux) / 100 if lux >= 0 else 0.01) if lux <= MAX_LUX else 1

    br = [f1, f2, f3]
    r *= br[factor]
    g *= br[factor]
    b *= br[factor]
    return math.ceil(r), math.ceil(g), math.ceil(b)


# Reference for this expression https://gist.github.com/popcorn245/30afa0f98eea1c2fd34d
def rgbTohue(r, g, b):
    # Standardize the values between 0 and 1
    (r, g, b) = (r / 255, g / 255, b / 255)

    hsv_colour = colorsys.rgb_to_hsv(r, g, b)
    hsv_colour_list = list(hsv_colour)
    hsv_colour_list[1] *= 254
    hsv_colour_list[2] *= 254
    final_colour = [int(x) for x in hsv_colour_list]

    # Apply gamma correction (same used to the devices screen)
    r = pow((r + 0.055) / (1.0 + 0.055), 2.4) if (r > 0.04045) else (r / 12.92)
    g = pow((g + 0.055) / (1.0 + 0.055), 2.4) if (g > 0.04045) else (g / 12.92)
    b = pow((b + 0.055) / (1.0 + 0.055), 2.4) if (b > 0.04045) else (b / 12.92)

    # Convert rgb to XYZ using RGB D65 conversion formula
    X = 0.649926 * r + 0.103455 * g + 0.197109 * b
    Y = 0.234327 * r + 0.743075 * g + 0.022598 * b
    Z = 0.000000 * r + 0.053077 * g + 1.035763 * b

    # Calculate the xy value
    x = X / (X + Y + Z)
    y = Y / (X + Y + Z)

    data = {
        "xy": [x, y],
        "sat": final_colour[1],
        "bri": final_colour[2]
    }
    return data
