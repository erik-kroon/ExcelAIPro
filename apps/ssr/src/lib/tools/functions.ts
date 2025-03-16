import * as formulajs from "@formulajs/formulajs";
import { tool, type Tool } from "ai";
import { z } from "zod";

type ExcelFunctionTools =
  | "DATE"
  | "DATEVALUE"
  | "DAY"
  | "DAYS"
  | "DAYS360"
  | "EDATE"
  | "EOMONTH"
  | "HOUR"
  | "MINUTE"
  | "ISOWEEKNUM"
  | "MONTH"
  | "NETWORKDAYS"
  | "NETWORKDAYSINTL"
  | "NOW"
  | "SECOND"
  | "TIME"
  | "TIMEVALUE"
  | "TODAY"
  | "WEEKDAY"
  | "YEAR"
  | "WEEKNUM"
  | "WORKDAY"
  | "WORKDAYINTL"
  | "YEARFRAC"
  | "ACCRINT"
  | "CUMIPMT"
  | "CUMPRINC"
  | "DB"
  | "DDB"
  | "DOLLARDE"
  | "DOLLARFR"
  | "EFFECT"
  | "FV"
  | "FVSCHEDULE"
  | "IPMT"
  | "IRR"
  | "ISPMT"
  | "MIRR"
  | "NOMINAL"
  | "NPER"
  | "NPV"
  | "PDURATION"
  | "PMT"
  | "PPMT"
  | "PV"
  | "RATE"
  | "BIN2DEC"
  | "BIN2HEX"
  | "BIN2OCT"
  | "BITAND"
  | "BITLSHIFT"
  | "BITOR"
  | "BITRSHIFT"
  | "BITXOR"
  | "COMPLEX"
  | "CONVERT"
  | "DEC2BIN"
  | "DEC2HEX"
  | "DEC2OCT"
  | "DELTA"
  | "ERF"
  | "ERFC"
  | "GESTEP"
  | "HEX2BIN"
  | "HEX2DEC"
  | "HEX2OCT"
  | "IMABS"
  | "IMAGINARY"
  | "IMARGUMENT"
  | "IMCONJUGATE"
  | "IMCOS"
  | "IMCOSH"
  | "IMCOT"
  | "IMCSC"
  | "IMCSCH"
  | "IMDIV"
  | "IMEXP"
  | "IMLN"
  | "IMLOG10"
  | "IMLOG2"
  | "IMPOWER"
  | "IMPRODUCT"
  | "IMREAL"
  | "IMSEC"
  | "IMSECH"
  | "IMSIN"
  | "IMSINH"
  | "IMSQRT"
  | "IMSUB"
  | "IMSUM"
  | "IMTAN"
  | "OCT2BIN"
  | "OCT2DEC"
  | "OCT2HEX"
  | "AND"
  | "FALSE"
  | "IF"
  | "IFS"
  | "IFERROR"
  | "IFNA"
  | "NOT"
  | "OR"
  | "SWITCH"
  | "TRUE"
  | "XOR"
  | "ABS"
  | "ACOS"
  | "ACOSH"
  | "ACOT"
  | "ACOTH"
  | "AGGREGATE"
  | "ARABIC"
  | "ASIN"
  | "ASINH"
  | "ATAN"
  | "ATAN2"
  | "ATANH"
  | "BASE"
  | "CEILING"
  | "CEILINGMATH"
  | "CEILINGPRECISE"
  | "COMBIN"
  | "COMBINA"
  | "COS"
  | "COSH"
  | "COT"
  | "COTH"
  | "CSC"
  | "CSCH"
  | "DECIMAL"
  | "EVEN"
  | "EXP"
  | "FACT"
  | "FACTDOUBLE"
  | "FLOOR"
  | "FLOORMATH"
  | "FLOORPRECISE"
  | "GCD"
  | "INT"
  | "ISEVEN"
  | "ISODD"
  | "LCM"
  | "LN"
  | "LOG"
  | "LOG10"
  | "MOD"
  | "MROUND"
  | "MULTINOMIAL"
  | "ODD"
  | "POWER"
  | "PRODUCT"
  | "QUOTIENT"
  | "RADIANS"
  | "RAND"
  | "RANDBETWEEN"
  | "ROUND"
  | "ROUNDDOWN"
  | "ROUNDUP"
  | "SEC"
  | "SECH"
  | "SIGN"
  | "SIN"
  | "SINH"
  | "SQRT"
  | "SQRTPI"
  | "SUBTOTAL"
  | "SUM"
  | "SUMIF"
  | "SUMIFS"
  | "SUMPRODUCT"
  | "SUMSQ"
  | "SUMX2MY2"
  | "SUMX2PY2"
  | "SUMXMY2"
  | "TAN"
  | "TANH"
  | "TRUNC"
  | "AVEDEV"
  | "AVERAGE"
  | "AVERAGEA"
  | "AVERAGEIF"
  | "AVERAGEIFS"
  | "BETADIST"
  | "BETAINV"
  | "BINOMDIST"
  | "CORREL"
  | "COUNT"
  | "COUNTA"
  | "COUNTBLANK"
  | "COUNTIF"
  | "COUNTIFS"
  | "COVARIANCEP"
  | "COVARIANCES"
  | "DEVSQ"
  | "EXPONDIST"
  | "FDIST"
  | "FINV"
  | "FISHER"
  | "FISHERINV"
  | "FORECAST"
  | "FREQUENCY"
  | "GAMMA"
  | "GAMMALN"
  | "GAUSS"
  | "GEOMEAN"
  | "GROWTH"
  | "HARMEAN"
  | "HYPGEOMDIST"
  | "INTERCEPT"
  | "KURT"
  | "LARGE"
  | "LINEST"
  | "LOGNORMDIST"
  | "LOGNORMINV"
  | "MAX"
  | "MAXA"
  | "MEDIAN"
  | "MIN"
  | "MINA"
  | "MODEMULT"
  | "MODESNGL"
  | "NORMDIST"
  | "NORMINV"
  | "NORMSDIST"
  | "NORMSINV"
  | "PEARSON"
  | "PERCENTILEEXC"
  | "PERCENTILEINC"
  | "PERCENTRANKEXC"
  | "PERCENTRANKINC"
  | "PERMUT"
  | "PERMUTATIONA"
  | "PHI"
  | "POISSONDIST"
  | "PROB"
  | "QUARTILEEXC"
  | "QUARTILEINC"
  | "RANKAVG"
  | "RANKEQ"
  | "RSQ"
  | "SKEW"
  | "SKEWP"
  | "SLOPE"
  | "SMALL"
  | "STANDARDIZE"
  | "STDEVA"
  | "STDEVP"
  | "STDEVPA"
  | "STDEVS"
  | "STEYX"
  | "TDIST"
  | "TINV"
  | "TRIMMEAN"
  | "VARA"
  | "VARP"
  | "VARPA"
  | "VARS"
  | "WEIBULLDIST"
  | "ZTEST"
  | "CHAR"
  | "CLEAN"
  | "CODE"
  | "CONCATENATE"
  | "EXACT"
  | "FIND"
  | "LEFT"
  | "LEN"
  | "LOWER"
  | "MID"
  | "NUMBERVALUE"
  | "PROPER"
  | "REPLACE"
  | "REPT"
  | "RIGHT"
  | "ROMAN"
  | "SEARCH"
  | "SUBSTITUTE"
  | "T"
  | "TRIM"
  | "TEXTJOIN"
  | "UNICHAR"
  | "UNICODE"
  | "UPPER";

export const excelFunctionTools = (config?: {
  excludeTools?: ExcelFunctionTools[];
}): Partial<Record<ExcelFunctionTools, Tool>> => {
  const tools: Partial<Record<ExcelFunctionTools, Tool>> = {
    DATE: tool({
      description: "Returns the number that represents the date in Excel date-time code.",
      parameters: z.object({
        year: z.number().describe("The year of the date. Can be 1900-9999"),
        month: z.number().describe("The month of the year. Can be 1-12"),
        day: z.number().describe("The day of the month. Can be 1-31"),
      }),
      execute: async ({ year, month, day }) => {
        return formulajs.DATE(year, month, day);
      },
    }),
    DATEVALUE: tool({
      description: "Returns the number that represents the date in Excel date-time code.",
      parameters: z.object({
        date_text: z.string().describe("Date in text format"),
      }),
      execute: async ({ date_text }) => {
        return formulajs.DATEVALUE(date_text);
      },
    }),
    DAY: tool({
      description: "Returns the day of a date, represented by a serial number.",
      parameters: z.object({
        serial_number: z.string().describe("Date in text format"),
      }),
      execute: async ({ serial_number }) => {
        return formulajs.DAY(serial_number);
      },
    }),
    DAYS: tool({
      description: "Returns the number of days between two dates.",
      parameters: z.object({
        end_date: z.string().describe("The later date"),
        start_date: z.string().describe("The earlier date"),
      }),
      execute: async ({ end_date, start_date }) => {
        return formulajs.DAYS(end_date, start_date);
      },
    }),
    DAYS360: tool({
      description:
        "Calculates the number of days between two dates based on a 360-day year (twelve 30-day months), which is used in some accounting calculations.",
      parameters: z.object({
        start_date: z.string().describe("The start date"),
        end_date: z.string().describe("The end date"),
      }),
      execute: async ({ start_date, end_date }) => {
        return formulajs.DAYS360(start_date, end_date, false);
      },
    }),
    EDATE: tool({
      description:
        "Returns the serial number that represents the date that is the indicated number of months before or after a specified date (start_date). Use EDATE to calculate maturity dates or due dates that fall on the same day of the month as the date of issue.",
      parameters: z.object({
        start_date: z.string().describe("A date that represents the start date"),
        months: z
          .number()
          .describe(
            "The number of months before or after start_date. A positive value for months yields a future date; a negative value yields a past date.",
          ),
      }),
      execute: async ({ start_date, months }) => {
        return formulajs.EDATE(start_date, months);
      },
    }),
    EOMONTH: tool({
      description:
        "Returns the serial number for the last day of the month that is the indicated number of months before or after start_date. Use EOMONTH to calculate maturity dates or due dates that fall on the last day of the month.",
      parameters: z.object({
        start_date: z.string().describe("A date that represents the start date"),
        months: z
          .number()
          .describe(
            "The number of months before or after start_date. A positive value for months yields a future date; a negative value yields a past date.",
          ),
      }),
      execute: async ({ start_date, months }) => {
        return formulajs.EOMONTH(start_date, months);
      },
    }),
    HOUR: tool({
      description:
        "Returns the hour of a time value. The hour is given as an integer, ranging from 0 (12:00 AM) to 23 (11:00 PM).",
      parameters: z.object({
        serial_number: z.string().describe("The time value"),
      }),
      execute: async ({ serial_number }) => {
        return formulajs.HOUR(serial_number);
      },
    }),
    MINUTE: tool({
      description:
        "Returns the minutes of a time value. The minute is given as an integer, ranging from 0 to 59.",
      parameters: z.object({
        serial_number: z.string().describe("The time value"),
      }),
      execute: async ({ serial_number }) => {
        return formulajs.MINUTE(serial_number);
      },
    }),
    ISOWEEKNUM: tool({
      description:
        "Returns the ISO week number of the year for a given date. The ISO week number is based on the ISO 8601 standard.",
      parameters: z.object({
        date: z.string().describe("The date"),
      }),
      execute: async ({ date }) => {
        return formulajs.ISOWEEKNUM(date);
      },
    }),
    MONTH: tool({
      description: "Returns the month of a date represented by a serial number.",
      parameters: z.object({
        serial_number: z.string().describe("The date"),
      }),
      execute: async ({ serial_number }) => {
        return formulajs.MONTH(serial_number);
      },
    }),
    NETWORKDAYS: tool({
      description:
        "Returns the number of whole working days between start_date and end_date. Working days exclude weekends and any dates identified as holidays.",
      parameters: z.object({
        start_date: z.string().describe("A date that represents the start date"),
        end_date: z.string().describe("A date that represents the end date"),
        holidays: z
          .array(z.string())
          .optional()
          .describe("An optional array of dates that represent holidays"),
      }),
      execute: async ({ start_date, end_date, holidays }) => {
        return formulajs.NETWORKDAYS(start_date, end_date, holidays);
      },
    }),
    NETWORKDAYSINTL: tool({
      description:
        "Returns the number of whole working days between two dates using parameters to indicate which and how many days are weekend days.",
      parameters: z.object({
        start_date: z.string().describe("A date that represents the start date"),
        end_date: z.string().describe("A date that represents the end date"),
        weekend: z
          .number()
          .optional()
          .describe(
            "Optional. A number or string indicating which days of the week are weekend days and how many weekend days there are. If weekend is omitted, it is assumed to be 1. See formula.js documentation for possible values.",
          ),
        holidays: z
          .array(z.string())
          .optional()
          .describe("An optional array of dates that represent holidays"),
      }),
      execute: async ({ start_date, end_date, weekend, holidays }) => {
        return formulajs.NETWORKDAYSINTL(start_date, end_date, weekend, holidays);
      },
    }),
    NOW: tool({
      description: "Returns the serial number of the current date and time.",
      parameters: z.object({}),
      execute: async () => {
        return formulajs.NOW();
      },
    }),
    SECOND: tool({
      description: "Returns the seconds of a time value.",
      parameters: z.object({
        serial_number: z.string().describe("The time value"),
      }),
      execute: async ({ serial_number }) => {
        return formulajs.SECOND(serial_number);
      },
    }),
    TIME: tool({
      description: "Returns the number that represents the time in Excel date-time code.",
      parameters: z.object({
        hour: z.number().describe("Hour (0 to 23)"),
        minute: z.number().describe("Minute (0 to 59)"),
        second: z.number().describe("Second (0 to 59)"),
      }),
      execute: async ({ hour, minute, second }) => {
        return formulajs.TIME(hour, minute, second);
      },
    }),
    TIMEVALUE: tool({
      description: "Returns the number that represents the time in text format.",
      parameters: z.object({
        time_text: z.string().describe("Time in text format"),
      }),
      execute: async ({ time_text }) => {
        return formulajs.TIMEVALUE(time_text);
      },
    }),
    TODAY: tool({
      description: "Returns the serial number of the current date.",
      parameters: z.object({}),
      execute: async () => {
        return formulajs.TODAY();
      },
    }),
    WEEKDAY: tool({
      description:
        "Returns the day of the week corresponding to a date. The day is given as an integer, ranging from 1 (Sunday) to 7 (Saturday), by default.",
      parameters: z.object({
        serial_number: z.string().describe("The date"),
        return_type: z
          .number()
          .optional()
          .describe(
            "Optional. A number specifying the return value. 1 (default) is Sunday (1) to Saturday (7). 2 is Monday (1) to Sunday (7). 3 is Monday (0) to Sunday (6).",
          ),
      }),
      execute: async ({ serial_number, return_type }) => {
        return formulajs.WEEKDAY(serial_number, return_type);
      },
    }),
    YEAR: tool({
      description: "Returns the year of a date.",
      parameters: z.object({
        serial_number: z.string().describe("The date"),
      }),
      execute: async ({ serial_number }) => {
        return formulajs.YEAR(serial_number);
      },
    }),
    WEEKNUM: tool({
      description:
        "Returns a number that indicates where the week falls numerically within a year.",
      parameters: z.object({
        serial_number: z.string().describe("The date"),
        return_type: z
          .number()
          .optional()
          .describe(
            "Optional. A number that determines the week starts.  1 (default) is Sunday, 2 is Monday.",
          ),
      }),
      execute: async ({ serial_number, return_type }) => {
        return formulajs.WEEKNUM(serial_number, return_type);
      },
    }),
    WORKDAY: tool({
      description:
        "Returns a number that represents a date that is the indicated number of working days before or after a date (the starting date). Working days exclude weekends and any dates identified as holidays.",
      parameters: z.object({
        start_date: z.string().describe("A date that represents the start date"),
        days: z.number().describe("The number of workdays before or after start_date"),
        holidays: z
          .array(z.string())
          .optional()
          .describe("An optional array of dates that represent holidays"),
      }),
      execute: async ({ start_date, days, holidays }) => {
        return formulajs.WORKDAY(start_date, days, holidays);
      },
    }),
    WORKDAYINTL: tool({
      description:
        "Returns the serial number for the date before or after a specified number of workdays with custom weekend parameters.",
      parameters: z.object({
        start_date: z.string().describe("A date that represents the start date"),
        days: z.number().describe("The number of workdays before or after start_date"),
        weekend: z
          .number()
          .optional()
          .describe(
            "Optional.  Indicates which days of the week are weekend days and how many weekend days there are. 1 is Sunday (1) to Saturday (7).",
          ),
        holidays: z
          .array(z.string())
          .optional()
          .describe("An optional array of dates that represent holidays"),
      }),
      execute: async ({ start_date, days, weekend, holidays }) => {
        return formulajs.WORKDAYINTL(start_date, days, weekend, holidays);
      },
    }),
    YEARFRAC: tool({
      description:
        "Calculates the fraction of the year represented by the number of whole days between two dates (start_date and end_date).",
      parameters: z.object({
        start_date: z.string().describe("The start date"),
        end_date: z.string().describe("The end date"),
        basis: z
          .number()
          .optional()
          .describe(
            "Optional.  The type of day count basis to use. 0 or omitted is US (NASD) 30/360. 1 is Actual/actual. 2 is Actual/360. 3 is Actual/365. 4 is European 30/360.",
          ),
      }),
      execute: async ({ start_date, end_date, basis }) => {
        return formulajs.YEARFRAC(start_date, end_date, basis);
      },
    }),
    ACCRINT: tool({
      description:
        "Calculates the accrued interest for a security that pays periodic interest.",
      parameters: z.object({
        issue: z.string().describe("The security's issue date."),
        first_interest: z.string().describe("The security's first interest date."),
        settlement: z.string().describe("The security's settlement date."),
        rate: z.number().describe("The security's annual coupon rate."),
        par: z.number().describe("The security's par value."),
        frequency: z
          .number()
          .describe(
            "The number of coupon payments per year. For annual payments, frequency = 1; for semiannual, frequency = 2; for quarterly, frequency = 4.",
          ),
        basis: z
          .number()
          .optional()
          .describe(
            "Optional. The type of day count basis to use. 0 or omitted is US (NASD) 30/360. 1 is Actual/actual. 2 is Actual/360. 3 is Actual/365. 4 is European 30/360.",
          ),
      }),
      execute: async ({
        issue,
        first_interest,
        settlement,
        rate,
        par,
        frequency,
        basis,
      }) => {
        return formulajs.ACCRINT(
          issue,
          first_interest,
          settlement,
          rate,
          par,
          frequency,
          basis,
        );
      },
    }),
    CUMIPMT: tool({
      description:
        "Returns the cumulative interest paid on a loan between start_period and end_period.",
      parameters: z.object({
        rate: z.number().describe("The interest rate."),
        nper: z.number().describe("The total number of payment periods."),
        pv: z.number().describe("The present value."),
        start_period: z.number().describe("The first period in the calculation."),
        end_period: z.number().describe("The last period in the calculation."),
        type: z
          .number()
          .describe(
            "The timing of the payment. 0 = payment is made at the end of the period. 1 = payment is made at the beginning of the period.",
          ),
      }),
      execute: async ({ rate, nper, pv, start_period, end_period, type }) => {
        return formulajs.CUMIPMT(rate, nper, pv, start_period, end_period, type);
      },
    }),
    CUMPRINC: tool({
      description:
        "Returns the cumulative principal paid on a loan between start_period and end_period.",
      parameters: z.object({
        rate: z.number().describe("The interest rate."),
        nper: z.number().describe("The total number of payment periods."),
        pv: z.number().describe("The present value."),
        start_period: z.number().describe("The first period in the calculation."),
        end_period: z.number().describe("The last period in the calculation."),
        type: z
          .number()
          .describe(
            "The timing of the payment. 0 = payment is made at the end of the period. 1 = payment is made at the beginning of the period.",
          ),
      }),
      execute: async ({ rate, nper, pv, start_period, end_period, type }) => {
        return formulajs.CUMPRINC(rate, nper, pv, start_period, end_period, type);
      },
    }),
    DB: tool({
      description:
        "Calculates the depreciation of an asset for a specified period using the fixed-declining balance method.",
      parameters: z.object({
        cost: z.number().describe("The initial cost of the asset."),
        salvage: z.number().describe("The value at the end of the depreciation."),
        life: z
          .number()
          .describe("The number of periods over which the asset is depreciated."),
        period: z
          .number()
          .describe("The period for which you want to calculate the depreciation."),
        month: z
          .number()
          .optional()
          .describe(
            "Optional. The number of months in the first year. If month is omitted, it is assumed to be 12.",
          ),
      }),
      execute: async ({ cost, salvage, life, period, month }) => {
        return formulajs.DB(cost, salvage, life, period, month);
      },
    }),
    DDB: tool({
      description:
        "Calculates the depreciation of an asset for a specified period using the double-declining balance method or some other method you specify.",
      parameters: z.object({
        cost: z.number().describe("The initial cost of the asset."),
        salvage: z.number().describe("The value at the end of the depreciation."),
        life: z
          .number()
          .describe("The number of periods over which the asset is depreciated."),
        period: z
          .number()
          .describe("The period for which you want to calculate the depreciation."),
        factor: z
          .number()
          .optional()
          .describe(
            "Optional. The rate at which the balance declines. If factor is omitted, it is assumed to be 2 (the double-declining balance method).",
          ),
      }),
      execute: async ({ cost, salvage, life, period, factor }) => {
        return formulajs.DDB(cost, salvage, life, period, factor);
      },
    }),
    DOLLARDE: tool({
      description:
        "Converts a dollar price expressed as a fraction into a dollar price expressed as a decimal number.",
      parameters: z.object({
        fractional_dollar: z
          .number()
          .describe(
            "A dollar number expressed as a fraction. The integer part of fractional_dollar is treated as the dollar number, and the fractional part is treated as the numerator of the fraction.",
          ),
        fraction: z
          .number()
          .describe("The integer to use in the denominator of a fraction."),
      }),
      execute: async ({ fractional_dollar, fraction }) => {
        return formulajs.DOLLARDE(fractional_dollar, fraction);
      },
    }),
    DOLLARFR: tool({
      description:
        "Converts a dollar price expressed as a decimal number into a dollar price expressed as a fraction.",
      parameters: z.object({
        decimal_dollar: z
          .number()
          .describe("A dollar number expressed as a decimal number"),
        fraction: z
          .number()
          .describe("The integer to use in the denominator of a fraction."),
      }),
      execute: async ({ decimal_dollar, fraction }) => {
        return formulajs.DOLLARFR(decimal_dollar, fraction);
      },
    }),
    EFFECT: tool({
      description:
        "Returns the effective annual interest rate, given the nominal annual interest rate and the number of compounding periods per year.",
      parameters: z.object({
        nominal_rate: z.number().describe("The nominal interest rate"),
        npery: z.number().describe("The number of compounding periods per year."),
      }),
      execute: async ({ nominal_rate, npery }) => {
        return formulajs.EFFECT(nominal_rate, npery);
      },
    }),
    FV: tool({
      description:
        "Returns the future value of an investment based on periodic, constant payments and a constant interest rate.",
      parameters: z.object({
        rate: z.number().describe("The interest rate per period."),
        nper: z.number().describe("The total number of payment periods in an annuity."),
        pmt: z
          .number()
          .describe(
            "The payment made each period; it cannot change over the life of the annuity. Typically, pmt includes principal and interest but no other fees or taxes.",
          ),
        pv: z
          .number()
          .optional()
          .describe(
            "Optional. The present value, or the lump-sum amount that a series of future payments is worth right now. If pv is omitted, it is assumed to be 0 (zero), and you must include pmt.",
          ),
        type: z
          .number()
          .optional()
          .describe(
            "Optional. The timing of the payment. 0 = payment is made at the end of the period. 1 = payment is made at the beginning of the period.",
          ),
      }),
      execute: async ({ rate, nper, pmt, pv, type }) => {
        return formulajs.FV(rate, nper, pmt, pv, type);
      },
    }),
    FVSCHEDULE: tool({
      description:
        "Returns the future value of an initial principal after applying a series of compound interest rates.",
      parameters: z.object({
        principal: z.number().describe("The initial principal"),
        schedule: z.array(z.number()).describe("A schedule of interest rates to apply"),
      }),
      execute: async ({ principal, schedule }) => {
        return formulajs.FVSCHEDULE(principal, schedule);
      },
    }),

    IPMT: tool({
      description:
        "Returns the interest payment for a given period for an investment, based on periodic, constant payments and a constant interest rate.",
      parameters: z.object({
        rate: z.number().describe("The interest rate per period."),
        per: z
          .number()
          .describe(
            "The period for which you want to find the interest. Per must be in the range 1 to nper, inclusive.",
          ),
        nper: z.number().describe("The total number of payment periods in an annuity."),
        pv: z
          .number()
          .describe(
            "The present value, or the lump-sum amount that a series of future payments is worth right now.",
          ),
        fv: z
          .number()
          .optional()
          .describe(
            "Optional. The future value, or a cash balance you want to attain after the last payment is made. If fv is omitted, it is assumed to be 0 (zero), that is, the future value of a loan is 0.",
          ),
        type: z
          .number()
          .optional()
          .describe(
            "Optional. The timing of the payment. 0 = payment is made at the end of the period. 1 = payment is made at the beginning of the period.",
          ),
      }),
      execute: async ({ rate, per, nper, pv, fv, type }) => {
        return formulajs.IPMT(rate, per, nper, pv, fv, type);
      },
    }),
    IRR: tool({
      description:
        "Returns the internal rate of return for a series of cash flows represented by the numbers in values.",
      parameters: z.object({
        values: z
          .array(z.number())
          .describe(
            "An array of numbers representing cash flows. Must contain at least one negative value (representing an initial investment) and one positive value.",
          ),
        guess: z
          .number()
          .optional()
          .describe(
            "Optional. A number that you guess is close to the result of IRR. If omitted, guess is assumed to be 0.1 (10 percent).",
          ),
      }),
      execute: async ({ values, guess }) => {
        return formulajs.IRR(values, guess);
      },
    }),
    ISPMT: tool({
      description: "Calculates the interest paid during a specific period of a loan.",
      parameters: z.object({
        rate: z.number().describe("The interest rate for the loan."),
        per: z
          .number()
          .describe(
            "The period for which you want to find the interest. Per must be in the range 1 to nper.",
          ),
        nper: z.number().describe("The total number of payment periods in an annuity."),
        pv: z
          .number()
          .describe(
            "The present value, or the lump-sum amount that a series of future payments is worth right now.",
          ),
      }),
      execute: async ({ rate, per, nper, pv }) => {
        return formulajs.ISPMT(rate, per, nper, pv);
      },
    }),
    MIRR: tool({
      description:
        "Returns the modified internal rate of return for a series of periodic cash flows.",
      parameters: z.object({
        values: z
          .array(z.number())
          .describe(
            "An array of numbers representing cash flows. Must contain at least one negative value (representing an initial investment) and one positive value.",
          ),
        finance_rate: z
          .number()
          .describe("The interest rate you pay on the money used in the cash flows."),
        reinvest_rate: z
          .number()
          .describe(
            "The interest rate you receive on the cash flows as you reinvest them.",
          ),
      }),
      execute: async ({ values, finance_rate, reinvest_rate }) => {
        return formulajs.MIRR(values, finance_rate, reinvest_rate);
      },
    }),
    NOMINAL: tool({
      description:
        "Returns the nominal annual interest rate, given the effective rate and the number of compounding periods per year.",
      parameters: z.object({
        effect_rate: z.number().describe("The effective interest rate."),
        npery: z.number().describe("The number of compounding periods per year."),
      }),
      execute: async ({ effect_rate, npery }) => {
        return formulajs.NOMINAL(effect_rate, npery);
      },
    }),
    NPER: tool({
      description:
        "Returns the number of periods for an investment based on periodic, constant payments and a constant interest rate.",
      parameters: z.object({
        rate: z.number().describe("The interest rate per period."),
        pmt: z
          .number()
          .describe(
            "The payment made each period; it cannot change over the life of the annuity. Typically, pmt includes principal and interest but no other fees or taxes.",
          ),
        pv: z
          .number()
          .describe(
            "The present value, or the lump-sum amount that a series of future payments is worth right now.",
          ),
        fv: z
          .number()
          .optional()
          .describe(
            "Optional. The future value, or a cash balance you want to attain after the last payment is made. If fv is omitted, it is assumed to be 0 (zero), that is, the future value of a loan is 0.",
          ),
        type: z
          .number()
          .optional()
          .describe(
            "Optional. The timing of the payment. 0 = payment is made at the end of the period. 1 = payment is made at the beginning of the period.",
          ),
      }),
      execute: async ({ rate, pmt, pv, fv, type }) => {
        return formulajs.NPER(rate, pmt, pv, fv, type);
      },
    }),
    NPV: tool({
      description:
        "Calculates the net present value of an investment by using a discount rate and a series of future payments (negative values) and income (positive values).",
      parameters: z.object({
        rate: z.number().describe("The rate of discount over one period."),
        values: z
          .array(z.number())
          .describe(
            "An array of numbers representing cash flows. Must be equally spaced in time and occur at the end of each period.",
          ),
      }),
      execute: async ({ rate, values }) => {
        return formulajs.NPV(rate, values);
      },
    }),
    PDURATION: tool({
      description:
        "Calculates the number of periods required for an investment to reach a specified value.",
      parameters: z.object({
        rate: z.number().describe("The interest rate per period."),
        pv: z.number().describe("The present value of the investment."),
        fv: z.number().describe("The future value to which you want to attain."),
      }),
      execute: async ({ rate, pv, fv }) => {
        return formulajs.PDURATION(rate, pv, fv);
      },
    }),
    PMT: tool({
      description:
        "Calculates the payment for a loan based on constant payments and a constant interest rate.",
      parameters: z.object({
        rate: z.number().describe("The interest rate for the loan."),
        nper: z.number().describe("The total number of payments for the loan."),
        pv: z
          .number()
          .describe(
            "The present value, or the lump-sum amount that a series of future payments is worth right now; also known as the principal.",
          ),
        fv: z
          .number()
          .optional()
          .describe(
            "Optional. The future value, or a cash balance you want to attain after the last payment is made. If fv is omitted, it is assumed to be 0 (zero), that is, the future value of a loan is 0.",
          ),
        type: z
          .number()
          .optional()
          .describe(
            "Optional. The timing of the payment. 0 = payment is made at the end of the period. 1 = payment is made at the beginning of the period.",
          ),
      }),
      execute: async ({ rate, nper, pv, fv, type }) => {
        return formulajs.PMT(rate, nper, pv, fv, type);
      },
    }),
    PPMT: tool({
      description:
        "Returns the principal payment for a given period for an investment based on periodic, constant payments and a constant interest rate.",
      parameters: z.object({
        rate: z.number().describe("The interest rate per period."),
        per: z
          .number()
          .describe(
            "The period for which you want to find the principal payment. Per must be in the range 1 to nper, inclusive.",
          ),
        nper: z.number().describe("The total number of payment periods in an annuity."),
        pv: z
          .number()
          .describe(
            "The present value, or the lump-sum amount that a series of future payments is worth right now.",
          ),
        fv: z
          .number()
          .optional()
          .describe(
            "Optional. The future value, or a cash balance you want to attain after the last payment is made. If fv is omitted, it is assumed to be 0 (zero), that is, the future value of a loan is 0.",
          ),
        type: z
          .number()
          .optional()
          .describe(
            "Optional. The timing of the payment. 0 = payment is made at the end of the period. 1 = payment is made at the beginning of the period.",
          ),
      }),
      execute: async ({ rate, per, nper, pv, fv, type }) => {
        return formulajs.PPMT(rate, per, nper, pv, fv, type);
      },
    }),
    PV: tool({
      description:
        "Returns the present value of an investment. The present value is the total amount that a series of future payments is worth now.",
      parameters: z.object({
        rate: z.number().describe("The interest rate per period."),
        nper: z.number().describe("The total number of payment periods in an annuity."),
        pmt: z
          .number()
          .describe(
            "The payment made each period; it cannot change over the life of the annuity. Typically, pmt includes principal and interest but no other fees or taxes.",
          ),
        fv: z
          .number()
          .optional()
          .describe(
            "Optional. The future value, or a cash balance you want to attain after the last payment is made. If fv is omitted, it is assumed to be 0 (zero), that is, the future value of an investment is 0.",
          ),
        type: z
          .number()
          .optional()
          .describe(
            "Optional. The timing of the payment. 0 = payment is made at the end of the period. 1 = payment is made at the beginning of the period.",
          ),
      }),
      execute: async ({ rate, nper, pmt, fv, type }) => {
        return formulajs.PV(rate, nper, pmt, fv, type);
      },
    }),
    RATE: tool({
      description:
        "Returns the interest rate per period of an annuity. RATE is calculated by iteration and can have zero or more solutions.",
      parameters: z.object({
        nper: z.number().describe("The total number of payment periods in an annuity."),
        pmt: z
          .number()
          .describe(
            "The payment made each period; it cannot change over the life of the annuity. Typically, pmt includes principal and interest but no other fees or taxes.",
          ),
        pv: z
          .number()
          .describe(
            "The present value, or the lump-sum amount that a series of future payments is worth right now.",
          ),
        fv: z
          .number()
          .optional()
          .describe(
            "Optional. The future value, or a cash balance you want to attain after the last payment is made. If fv is omitted, it is assumed to be 0 (zero), that is, the future value of an investment is 0.",
          ),
        type: z
          .number()
          .optional()
          .describe(
            "Optional. The timing of the payment. 0 = payment is made at the end of the period. 1 = payment is made at the beginning of the period.",
          ),
        guess: z
          .number()
          .optional()
          .describe(
            "Optional. A number that you guess is close to the result of RATE. If omitted, guess is assumed to be 0.1 (10 percent).",
          ),
      }),
      execute: async ({ nper, pmt, pv, fv, type, guess }) => {
        return formulajs.RATE(nper, pmt, pv, fv, type, guess);
      },
    }),
    BIN2DEC: tool({
      description: "Converts a binary number to decimal.",
      parameters: z.object({
        number: z
          .string()
          .describe(
            "The binary number you want to convert. Number can contain a maximum of 10 characters (10 bits).",
          ),
      }),
      execute: async ({ number }) => {
        return formulajs.BIN2DEC(number);
      },
    }),
    BIN2HEX: tool({
      description: "Converts a binary number to hexadecimal.",
      parameters: z.object({
        number: z
          .string()
          .describe(
            "The binary number you want to convert. Number can contain a maximum of 10 characters (10 bits).",
          ),
      }),
      execute: async ({ number }) => {
        return formulajs.BIN2HEX(number, 10);
      },
    }),
    BIN2OCT: tool({
      description: "Converts a binary number to octal.",
      parameters: z.object({
        number: z
          .string()
          .describe(
            "The binary number you want to convert. Number can contain a maximum of 10 characters (10 bits).",
          ),
      }),
      execute: async ({ number }) => {
        return formulajs.BIN2OCT(number, 10);
      },
    }),
    BITAND: tool({
      description: "Returns a 'Bitwise And' of two numbers.",
      parameters: z.object({
        number1: z.number().describe("The first number."),
        number2: z.number().describe("The second number."),
      }),
      execute: async ({ number1, number2 }) => {
        return formulajs.BITAND(number1, number2);
      },
    }),
    BITLSHIFT: tool({
      description: "Returns a value number shifted left by shift_amount bits.",
      parameters: z.object({
        number: z.number().describe("The number you want to shift."),
        shift_amount: z
          .number()
          .describe("The number of bits by which you want to shift number."),
      }),
      execute: async ({ number, shift_amount }) => {
        return formulajs.BITLSHIFT(number, shift_amount);
      },
    }),
    BITOR: tool({
      description: "Returns a bitwise OR of two numbers.",
      parameters: z.object({
        number1: z.number().describe("The first number."),
        number2: z.number().describe("The second number."),
      }),
      execute: async ({ number1, number2 }) => {
        return formulajs.BITOR(number1, number2);
      },
    }),
    BITRSHIFT: tool({
      description: "Returns a value number shifted right by shift_amount bits.",
      parameters: z.object({
        number: z.number().describe("The number you want to shift."),
        shift_amount: z
          .number()
          .describe("The number of bits by which you want to shift number."),
      }),
      execute: async ({ number, shift_amount }) => {
        return formulajs.BITRSHIFT(number, shift_amount);
      },
    }),
    BITXOR: tool({
      description: "Returns a bitwise XOR of two numbers.",
      parameters: z.object({
        number1: z.number().describe("The first number."),
        number2: z.number().describe("The second number."),
      }),
      execute: async ({ number1, number2 }) => {
        return formulajs.BITXOR(number1, number2);
      },
    }),
    COMPLEX: tool({
      description:
        "Converts real and imaginary coefficients into a complex number of the form x + yi or x + yj.",
      parameters: z.object({
        real_num: z.number().describe("The real coefficient of the complex number."),
        i_num: z.number().describe("The imaginary coefficient of the complex number."),
      }),
      execute: async ({ real_num, i_num }) => {
        return formulajs.COMPLEX(real_num, i_num, undefined);
      },
    }),
    CONVERT: tool({
      description: "Converts a number from one measurement system to another.",
      parameters: z.object({
        number: z.number().describe("The value to convert."),
        from_unit: z.string().describe("The unit for number."),
        to_unit: z.string().describe("The unit to you want the result."),
      }),
      execute: async ({ number, from_unit, to_unit }) => {
        return formulajs.CONVERT(number, from_unit, to_unit);
      },
    }),
    DEC2BIN: tool({
      description: "Converts a decimal number to binary.",
      parameters: z.object({
        number: z
          .number()
          .describe(
            "The decimal integer you want to convert. If number is negative, valid place_values are ignored, and DEC2BIN returns a 10-character (10-bit) binary number in which the most significant bit is the sign bit. The remaining 9 bits are magnitude bits. Negative numbers are represented using two's-complement notation.",
          ),
      }),
      execute: async ({ number }) => {
        return formulajs.DEC2BIN(number, 10);
      },
    }),
    DEC2HEX: tool({
      description: "Converts a decimal number to hexadecimal.",
      parameters: z.object({
        number: z
          .number()
          .describe(
            "The decimal integer you want to convert. If number is negative, valid place_values are ignored, and DEC2BIN returns a 10-character (10-bit) binary number in which the most significant bit is the sign bit. The remaining 9 bits are magnitude bits. Negative numbers are represented using two's-complement notation.",
          ),
      }),
      execute: async ({ number }) => {
        return formulajs.DEC2HEX(number, 10);
      },
    }),
    DEC2OCT: tool({
      description: "Converts a decimal number to octal.",
      parameters: z.object({
        number: z
          .number()
          .describe(
            "The decimal integer you want to convert. If number is negative, valid place_values are ignored, and DEC2BIN returns a 10-character (10-bit) binary number in which the most significant bit is the sign bit. The remaining 9 bits are magnitude bits. Negative numbers are represented using two's-complement notation.",
          ),
      }),
      execute: async ({ number }) => {
        return formulajs.DEC2OCT(number, 10);
      },
    }),
    DELTA: tool({
      description: "Tests whether two values are equal.",
      parameters: z.object({
        number1: z.number().describe("The first number."),
        number2: z
          .number()
          .optional()
          .describe("The second number. If omitted, value is assumed to be zero."),
      }),
      execute: async ({ number1, number2 }) => {
        return formulajs.DELTA(number1, number2);
      },
    }),
    ERF: tool({
      description: "Returns the error function integrated between 0 and lower_limit.",
      parameters: z.object({
        z: z
          .number()
          .describe(
            "The lower bound for integrating ERF. If omitted, value is assumed to be zero.",
          ),
      }),
      execute: async ({ z }) => {
        return formulajs.ERF(z, undefined);
      },
    }),
    ERFC: tool({
      description:
        "Returns the complementary ERF function integrated between x and infinity.",
      parameters: z.object({
        x: z.number().describe("The lower bound for integrating ERFC."),
      }),
      execute: async ({ x }) => {
        return formulajs.ERFC(x);
      },
    }),
    GESTEP: tool({
      description: "Returns 1 if number >= step; otherwise, returns 0 (zero).",
      parameters: z.object({
        number: z.number().describe("The number to test."),
        step: z
          .number()
          .optional()
          .describe("The threshold value. If you omit step, GESTEP uses zero."),
      }),
      execute: async ({ number, step }) => {
        return formulajs.GESTEP(number, step);
      },
    }),
    HEX2BIN: tool({
      description: "Converts a hexadecimal number to binary.",
      parameters: z.object({
        number: z.string().describe("The hexadecimal number you want to convert."),
      }),
      execute: async ({ number }) => {
        return formulajs.HEX2BIN(number, 10);
      },
    }),
    HEX2DEC: tool({
      description: "Converts a hexadecimal number to decimal.",
      parameters: z.object({
        number: z.string().describe("The hexadecimal number you want to convert."),
      }),
      execute: async ({ number }) => {
        return formulajs.HEX2DEC(number);
      },
    }),
    HEX2OCT: tool({
      description: "Converts a hexadecimal number to octal.",
      parameters: z.object({
        number: z.string().describe("The hexadecimal number you want to convert."),
      }),
      execute: async ({ number }) => {
        return formulajs.HEX2OCT(number, 10);
      },
    }),
    IMABS: tool({
      description: "Returns the absolute value (modulus) of a complex number.",
      parameters: z.object({
        inumber: z
          .string()
          .describe("The complex number for which you want the absolute value."),
      }),
      execute: async ({ inumber }) => {
        return formulajs.IMABS(inumber);
      },
    }),
    IMAGINARY: tool({
      description: "Returns the imaginary coefficient of a complex number.",
      parameters: z.object({
        inumber: z
          .string()
          .describe("The complex number for which you want the imaginary coefficient."),
      }),
      execute: async ({ inumber }) => {
        return formulajs.IMAGINARY(inumber);
      },
    }),
    IMARGUMENT: tool({
      description: "Returns the argument theta, an angle expressed in radians.",
      parameters: z.object({
        inumber: z
          .string()
          .describe("The complex number for which you want the argument."),
      }),
      execute: async ({ inumber }) => {
        return formulajs.IMARGUMENT(inumber);
      },
    }),
    IMCONJUGATE: tool({
      description: "Returns the complex conjugate of a complex number.",
      parameters: z.object({
        inumber: z
          .string()
          .describe("The complex number for which you want the conjugate."),
      }),
      execute: async ({ inumber }) => {
        return formulajs.IMCONJUGATE(inumber);
      },
    }),
    IMCOS: tool({
      description: "Returns the cosine of a complex number.",
      parameters: z.object({
        inumber: z.string().describe("The complex number for which you want the cosine."),
      }),
      execute: async ({ inumber }) => {
        return formulajs.IMCOS(inumber);
      },
    }),
    IMCOSH: tool({
      description: "Returns the hyperbolic cosine of a complex number.",
      parameters: z.object({
        inumber: z
          .string()
          .describe("The complex number for which you want the hyperbolic cosine."),
      }),
      execute: async ({ inumber }) => {
        return formulajs.IMCOSH(inumber);
      },
    }),
    IMCOT: tool({
      description: "Returns the cotangent of a complex number.",
      parameters: z.object({
        inumber: z
          .string()
          .describe("The complex number for which you want the cotangent."),
      }),
      execute: async ({ inumber }) => {
        return formulajs.IMCOT(inumber);
      },
    }),
    IMCSC: tool({
      description: "Returns the cosecant of a complex number.",
      parameters: z.object({
        inumber: z
          .string()
          .describe("The complex number for which you want the cosecant."),
      }),
      execute: async ({ inumber }) => {
        return formulajs.IMCSC(inumber);
      },
    }),
    IMCSCH: tool({
      description: "Returns the hyperbolic cosecant of a complex number.",
      parameters: z.object({
        inumber: z
          .string()
          .describe("The complex number for which you want the hyperbolic cosecant."),
      }),
      execute: async ({ inumber }) => {
        return formulajs.IMCSCH(inumber);
      },
    }),
    IMDIV: tool({
      description: "Returns the quotient of two complex numbers.",
      parameters: z.object({
        inumber1: z.string().describe("The complex number to be divided."),
        inumber2: z.string().describe("The complex number by which to divide."),
      }),
      execute: async ({ inumber1, inumber2 }) => {
        return formulajs.IMDIV(inumber1, inumber2);
      },
    }),
    IMEXP: tool({
      description: "Returns the exponential of a complex number.",
      parameters: z.object({
        inumber: z
          .string()
          .describe("The complex number for which you want the exponential."),
      }),
      execute: async ({ inumber }) => {
        return formulajs.IMEXP(inumber);
      },
    }),
    IMLN: tool({
      description: "Returns the natural logarithm of a complex number.",
      parameters: z.object({
        inumber: z
          .string()
          .describe("The complex number for which you want the natural logarithm."),
      }),
      execute: async ({ inumber }) => {
        return formulajs.IMLN(inumber);
      },
    }),
    IMLOG10: tool({
      description: "Returns the common logarithm (base 10) of a complex number.",
      parameters: z.object({
        inumber: z
          .string()
          .describe("The complex number for which you want the common logarithm."),
      }),
      execute: async ({ inumber }) => {
        return formulajs.IMLOG10(inumber);
      },
    }),
    IMLOG2: tool({
      description: "Returns the base-2 logarithm of a complex number.",
      parameters: z.object({
        inumber: z
          .string()
          .describe("The complex number for which you want the base-2 logarithm."),
      }),
      execute: async ({ inumber }) => {
        return formulajs.IMLOG2(inumber);
      },
    }),
    IMPOWER: tool({
      description: "Returns a complex number raised to a power.",
      parameters: z.object({
        inumber: z.string().describe("The complex number you want to raise to a power."),
        number: z
          .number()
          .describe("The power to which you want to raise the complex number."),
      }),
      execute: async ({ inumber, number }) => {
        return formulajs.IMPOWER(inumber, number);
      },
    }),
    IMPRODUCT: tool({
      description: "Returns the product of 2 to 255 complex numbers.",
      parameters: z.object({
        inumbers: z
          .array(z.string())
          .describe(
            "The complex numbers to multiply. Between 2 and 255 complex numbers.",
          ),
      }),
      execute: async ({ inumbers }) => {
        return formulajs.IMPRODUCT(...inumbers);
      },
    }),
    IMREAL: tool({
      description: "Returns the real coefficient of a complex number.",
      parameters: z.object({
        inumber: z
          .string()
          .describe("The complex number for which you want the real coefficient."),
      }),
      execute: async ({ inumber }) => {
        return formulajs.IMREAL(inumber);
      },
    }),
    IMSEC: tool({
      description: "Returns the secant of a complex number.",
      parameters: z.object({
        inumber: z.string().describe("The complex number for which you want the secant."),
      }),
      execute: async ({ inumber }) => {
        return formulajs.IMSEC(inumber);
      },
    }),
    IMSECH: tool({
      description: "Returns the hyperbolic secant of a complex number.",
      parameters: z.object({
        inumber: z
          .string()
          .describe("The complex number for which you want the hyperbolic secant."),
      }),
      execute: async ({ inumber }) => {
        return formulajs.IMSECH(inumber);
      },
    }),
    IMSIN: tool({
      description: "Returns the sine of a complex number.",
      parameters: z.object({
        inumber: z.string().describe("The complex number for which you want the sine."),
      }),
      execute: async ({ inumber }) => {
        return formulajs.IMSIN(inumber);
      },
    }),
    IMSINH: tool({
      description: "Returns the hyperbolic sine of a complex number.",
      parameters: z.object({
        inumber: z
          .string()
          .describe("The complex number for which you want the hyperbolic sine."),
      }),
      execute: async ({ inumber }) => {
        return formulajs.IMSINH(inumber);
      },
    }),
    IMSQRT: tool({
      description: "Returns the square root of a complex number.",
      parameters: z.object({
        inumber: z
          .string()
          .describe("The complex number for which you want the square root."),
      }),
      execute: async ({ inumber }) => {
        return formulajs.IMSQRT(inumber);
      },
    }),
    IMSUB: tool({
      description: "Returns the difference between two complex numbers.",
      parameters: z.object({
        inumber1: z.string().describe("The complex number from which to subtract."),
        inumber2: z.string().describe("The complex number to subtract."),
      }),
      execute: async ({ inumber1, inumber2 }) => {
        return formulajs.IMSUB(inumber1, inumber2);
      },
    }),
    IMSUM: tool({
      description: "Returns the sum of complex numbers.",
      parameters: z.object({
        inumbers: z
          .array(z.string())
          .describe("The complex numbers to add.  Between 1 and 255 complex numbers."),
      }),
      execute: async ({ inumbers }) => {
        return formulajs.IMSUM(...inumbers);
      },
    }),
    IMTAN: tool({
      description: "Returns the tangent of a complex number.",
      parameters: z.object({
        inumber: z
          .string()
          .describe("The complex number for which you want the tangent."),
      }),
      execute: async ({ inumber }) => {
        return formulajs.IMTAN(inumber);
      },
    }),
    OCT2BIN: tool({
      description: "Converts an octal number to binary.",
      parameters: z.object({
        number: z.string().describe("The octal number you want to convert."),
      }),
      execute: async ({ number }) => {
        return formulajs.OCT2BIN(number, 10);
      },
    }),
    OCT2DEC: tool({
      description: "Converts an octal number to decimal.",
      parameters: z.object({
        number: z.string().describe("The octal number you want to convert."),
      }),
      execute: async ({ number }) => {
        return formulajs.OCT2DEC(number);
      },
    }),
    OCT2HEX: tool({
      description: "Converts an octal number to hexadecimal.",
      parameters: z.object({
        number: z.string().describe("The octal number you want to convert."),
      }),
      execute: async ({ number }) => {
        return formulajs.OCT2HEX(number, 10);
      },
    }),
    AND: tool({
      description: "Returns TRUE if all arguments are TRUE.",
      parameters: z.object({
        logical: z
          .array(z.boolean())
          .describe(
            "An array of conditions that you want to test that can be either TRUE or FALSE.",
          ),
      }),
      execute: async ({ logical }) => {
        return formulajs.AND(...logical);
      },
    }),
    FALSE: tool({
      description: "Returns the logical value FALSE.",
      parameters: z.object({}),
      execute: async () => {
        return formulajs.FALSE();
      },
    }),
    IF: tool({
      description: "Specifies a logical test to perform.",
      parameters: z.object({
        logical_test: z
          .boolean()
          .describe("Any value or expression that can be evaluated to TRUE or FALSE."),
        value_if_true: z
          .string()
          .describe("The value that is returned if logical_test is TRUE."),
        value_if_false: z
          .string()
          .describe("The value that is returned if logical_test is FALSE."),
      }),
      execute: async ({ logical_test, value_if_true, value_if_false }) => {
        return formulajs.IF(logical_test, value_if_true, value_if_false);
      },
    }),
    IFS: tool({
      description:
        "Checks whether one or more conditions are met and returns a value that corresponds to the first TRUE condition.",
      parameters: z.object({
        logical_test: z
          .array(z.boolean())
          .describe(
            "An array of conditions that you want to test that can be either TRUE or FALSE.",
          ),
        value_if_true: z
          .array(z.string())
          .describe("An array of values that is returned if logical_test is TRUE."),
      }),
      execute: async ({ logical_test, value_if_true }) => {
        return formulajs.IFS(
          ...logical_test.map((test, index) => [test, value_if_true[index]]).flat(),
        );
      },
    }),
    IFERROR: tool({
      description:
        "Returns value if the expression is an error and the value of the expression itself otherwise.",
      parameters: z.object({
        value: z.string().describe("Argument that is checked for an error."),
        value_if_error: z
          .string()
          .describe("The value to return if the expression evaluates to an error."),
      }),
      execute: async ({ value, value_if_error }) => {
        return formulajs.IFERROR(value, value_if_error);
      },
    }),
    IFNA: tool({
      description:
        "Returns the value you specify if the expression resolves to #N/A, otherwise returns the result of the expression.",
      parameters: z.object({
        value: z.string().describe("Argument that is checked for #N/A error."),
        value_if_na: z
          .string()
          .describe("The value to return if the expression evaluates to #N/A."),
      }),
      execute: async ({ value, value_if_na }) => {
        return formulajs.IFNA(value, value_if_na);
      },
    }),
    NOT: tool({
      description: "Reverses the value of its argument.",
      parameters: z.object({
        logical: z
          .boolean()
          .describe("A value or expression that can be evaluated to TRUE or FALSE."),
      }),
      execute: async ({ logical }) => {
        return formulajs.NOT(logical);
      },
    }),
    OR: tool({
      description: "Returns TRUE if any argument is TRUE.",
      parameters: z.object({
        logical: z
          .array(z.boolean())
          .describe(
            "An array of conditions that you want to test that can be either TRUE or FALSE.",
          ),
      }),
      execute: async ({ logical }) => {
        return formulajs.OR(...logical);
      },
    }),
    SWITCH: tool({
      description:
        "Evaluates an expression against a list of values and returns the result corresponding to the first matching value. If there is no match, an optional default value is returned.",
      parameters: z.object({
        expression: z.number().describe("The expression that you want to evaluate."),
        value: z
          .array(z.string())
          .describe("An array of values to match against expression."),
        result: z
          .array(z.string())
          .describe(
            "An array of results that is returned if the expression matches a value.",
          ),
      }),
      execute: async ({ expression, value, result }) => {
        return formulajs.SWITCH(
          expression,
          ...value.map((val, index) => [val, result[index]]).flat(),
        );
      },
    }),
    TRUE: tool({
      description: "Returns the logical value TRUE.",
      parameters: z.object({}),
      execute: async () => {
        return formulajs.TRUE();
      },
    }),
    XOR: tool({
      description: "Returns a logical exclusive OR of all arguments.",
      parameters: z.object({
        logical: z
          .array(z.boolean())
          .describe(
            "An array of conditions that you want to test that can be either TRUE or FALSE.",
          ),
      }),
      execute: async ({ logical }) => {
        return formulajs.XOR(...logical);
      },
    }),
    ABS: tool({
      description: "Returns the absolute value of a number.",
      parameters: z.object({
        number: z.number().describe("The number for which you want the absolute value."),
      }),
      execute: async ({ number }) => {
        return formulajs.ABS(number);
      },
    }),
    ACOS: tool({
      description: "Returns the arccosine, or inverse cosine, of a number.",
      parameters: z.object({
        number: z
          .number()
          .describe("The cosine of the angle you want. Must be from -1 to 1."),
      }),
      execute: async ({ number }) => {
        return formulajs.ACOS(number);
      },
    }),
    ACOSH: tool({
      description: "Returns the inverse hyperbolic cosine of number.",
      parameters: z.object({
        number: z.number().describe("Any real number equal to or greater than 1."),
      }),
      execute: async ({ number }) => {
        return formulajs.ACOSH(number);
      },
    }),
    ACOT: tool({
      description: "Returns the arccotangent of a number.",
      parameters: z.object({
        number: z.number().describe("The number for which you want the arccotangent."),
      }),
      execute: async ({ number }) => {
        return formulajs.ACOT(number);
      },
    }),
    ACOTH: tool({
      description: "Returns the hyperbolic arccotangent of a number.",
      parameters: z.object({
        number: z.number().describe("Any real number equal to or greater than 1."),
      }),
      execute: async ({ number }) => {
        return formulajs.ACOTH(number);
      },
    }),
    AGGREGATE: tool({
      description: "Returns an aggregate in a list or database.",
      parameters: z.object({
        function_num: z
          .number()
          .describe("A number from 1 to 19 specifying which function to use."),
        options: z
          .number()
          .describe(
            "A number determining which values should be ignored in the evaluation range.",
          ),
        array: z
          .array(z.union([z.number(), z.string(), z.boolean()]))
          .describe("An array of numbers that you want to aggregate."),
      }),
      execute: async ({ function_num, options, array }) => {
        return formulajs.AGGREGATE(function_num, options, array, undefined);
      },
    }),
    ARABIC: tool({
      description: "Converts a Roman numeral to an Arabic numeral.",
      parameters: z.object({
        text: z
          .string()
          .describe(
            "A string enclosed in quotation marks, an empty string (''), or a reference to a cell containing text. If text is not a valid Roman numeral, ARABIC returns the #VALUE! error value.",
          ),
      }),
      execute: async ({ text }) => {
        return formulajs.ARABIC(text);
      },
    }),
    ASIN: tool({
      description: "Returns the arcsine, or inverse sine, of a number.",
      parameters: z.object({
        number: z
          .number()
          .describe("The sine of the angle you want. Must be from -1 to 1."),
      }),
      execute: async ({ number }) => {
        return formulajs.ASIN(number);
      },
    }),
    ASINH: tool({
      description: "Returns the inverse hyperbolic sine of number.",
      parameters: z.object({
        number: z.number().describe("Any real number."),
      }),
      execute: async ({ number }) => {
        return formulajs.ASINH(number);
      },
    }),
    ATAN: tool({
      description: "Returns the arctangent, or inverse tangent, of a number.",
      parameters: z.object({
        number: z.number().describe("The tangent of the angle you want."),
      }),
      execute: async ({ number }) => {
        return formulajs.ATAN(number);
      },
    }),
    ATAN2: tool({
      description:
        "Returns the arctangent, or inverse tangent, of the specified x- and y-coordinates.",
      parameters: z.object({
        x_num: z.number().describe("The x-coordinate of the point."),
        y_num: z.number().describe("The y-coordinate of the point."),
      }),
      execute: async ({ x_num, y_num }) => {
        return formulajs.ATAN2(x_num, y_num);
      },
    }),
    ATANH: tool({
      description: "Returns the inverse hyperbolic tangent of a number.",
      parameters: z.object({
        number: z.number().describe("A number between -1 and 1 (excluding -1 and 1)."),
      }),
      execute: async ({ number }) => {
        return formulajs.ATANH(number);
      },
    }),
    BASE: tool({
      description:
        "Converts a number into a text representation with the given radix (base).",
      parameters: z.object({
        number: z
          .number()
          .describe(
            "The number you want to convert. Must be an integer >= 0 and < 2^53.",
          ),
        radix: z
          .number()
          .describe(
            "The base radix that you want to convert number into. Must be an integer >= 2 and <= 36.",
          ),
        min_length: z
          .number()
          .optional()
          .describe(
            "Optional. The minimum length of the returned string. Must be an integer >= 0. If omitted, the returned string is the minimum length.",
          ),
      }),
      execute: async ({ number, radix, min_length }) => {
        return formulajs.BASE(number, radix, min_length);
      },
    }),
    CEILING: tool({
      description:
        "Rounds a number the nearest integer or to the nearest multiple of significance.",
      parameters: z.object({
        number: z.number().describe("The number you want to round."),
        significance: z
          .number()
          .describe(
            "The multiple to which you want to round. The number and significance must have the same sign.",
          ),
      }),
      execute: async ({ number, significance }) => {
        return formulajs.CEILING(number, significance);
      },
    }),
    CEILINGMATH: tool({
      description:
        "Rounds a number up to the nearest integer or to the nearest multiple of significance.",
      parameters: z.object({
        number: z.number().describe("The number you want to round."),
        significance: z
          .number()
          .optional()
          .describe(
            "Optional. The multiple to which you want to round. The number and significance must have the same sign.",
          ),
        mode: z
          .number()
          .optional()
          .describe(
            "Optional.  If number is negative, CEILINGMATH rounds toward or away from zero. 0 (zero) or omitted rounds away from zero. Any other value rounds toward zero.",
          ),
      }),
      execute: async ({ number, significance, mode }) => {
        return formulajs.CEILINGMATH(number, significance, mode);
      },
    }),
    CEILINGPRECISE: tool({
      description:
        "Rounds a number up to the nearest integer or to the nearest multiple of significance.",
      parameters: z.object({
        number: z.number().describe("The number you want to round."),
        significance: z
          .number()
          .optional()
          .describe(
            "Optional. The multiple to which you want to round. The number and significance do not need to have the same sign.",
          ),
      }),
      execute: async ({ number, significance }) => {
        return formulajs.CEILINGPRECISE(number, significance);
      },
    }),
    COMBIN: tool({
      description: "Returns the number of combinations for a given number of items.",
      parameters: z.object({
        number: z.number().describe("The number of items."),
        number_chosen: z.number().describe("The number of items in each combination."),
      }),
      execute: async ({ number, number_chosen }) => {
        return formulajs.COMBIN(number, number_chosen);
      },
    }),
    COMBINA: tool({
      description:
        "Returns the number of combinations with repetitions for a given number of items.",
      parameters: z.object({
        number: z.number().describe("The number of items."),
        number_chosen: z.number().describe("The number of items in each combination."),
      }),
      execute: async ({ number, number_chosen }) => {
        return formulajs.COMBINA(number, number_chosen);
      },
    }),
    COS: tool({
      description: "Returns the cosine of the given angle.",
      parameters: z.object({
        number: z
          .number()
          .describe("The angle in radians for which you want the cosine."),
      }),
      execute: async ({ number }) => {
        return formulajs.COS(number);
      },
    }),
    COSH: tool({
      description: "Returns the hyperbolic cosine of a number.",
      parameters: z.object({
        number: z
          .number()
          .describe(
            "Any real number for which you want to calculate the hyperbolic cosine.",
          ),
      }),
      execute: async ({ number }) => {
        return formulajs.COSH(number);
      },
    }),
    COT: tool({
      description: "Returns the cotangent of an angle specified in radians.",
      parameters: z.object({
        number: z
          .number()
          .describe("The angle in radians for which you want the cotangent."),
      }),
      execute: async ({ number }) => {
        return formulajs.COT(number);
      },
    }),
    COTH: tool({
      description: "Returns the hyperbolic cotangent of a number.",
      parameters: z.object({
        number: z
          .number()
          .describe(
            "Any real number for which you want to calculate the hyperbolic cotangent.",
          ),
      }),
      execute: async ({ number }) => {
        return formulajs.COTH(number);
      },
    }),
    CSC: tool({
      description: "Returns the cosecant of an angle specified in radians.",
      parameters: z.object({
        number: z
          .number()
          .describe("The angle in radians for which you want the cosecant."),
      }),
      execute: async ({ number }) => {
        return formulajs.CSC(number);
      },
    }),
    CSCH: tool({
      description: "Returns the hyperbolic cosecant of a number.",
      parameters: z.object({
        number: z
          .number()
          .describe(
            "Any real number for which you want to calculate the hyperbolic cosecant.",
          ),
      }),
      execute: async ({ number }) => {
        return formulajs.CSCH(number);
      },
    }),
    DECIMAL: tool({
      description:
        "Converts a text representation of a number in a given base into a decimal number.",
      parameters: z.object({
        text: z
          .string()
          .describe(
            "The text string you want to convert. It can be specified as a string enclosed in quotation marks, or as a reference to a cell containing the string.",
          ),
        radix: z
          .number()
          .describe(
            "The base radix that text is in. Radix must be an integer >= 2 and <= 36.",
          ),
      }),
      execute: async ({ text, radix }) => {
        return formulajs.DECIMAL(text, radix);
      },
    }),
    EVEN: tool({
      description: "Rounds number up to the nearest even integer.",
      parameters: z.object({
        number: z.number().describe("The value to round."),
      }),
      execute: async ({ number }) => {
        return formulajs.EVEN(number);
      },
    }),
    EXP: tool({
      description: "Returns e raised to the power of number.",
      parameters: z.object({
        number: z.number().describe("The exponent applied to e."),
      }),
      execute: async ({ number }) => {
        return formulajs.EXP(number);
      },
    }),
    FACT: tool({
      description: "Returns the factorial of a number.",
      parameters: z.object({
        number: z.number().describe("The non-negative number you want the factorial of."),
      }),
      execute: async ({ number }) => {
        return formulajs.FACT(number);
      },
    }),
    FACTDOUBLE: tool({
      description: "Returns the double factorial of a number.",
      parameters: z.object({
        number: z
          .number()
          .describe("The non-negative number you want the double factorial of."),
      }),
      execute: async ({ number }) => {
        return formulajs.FACTDOUBLE(number);
      },
    }),
    FLOOR: tool({
      description:
        "Rounds a number the nearest integer or to the nearest multiple of significance.",
      parameters: z.object({
        number: z.number().describe("The number you want to round."),
        significance: z
          .number()
          .describe(
            "The multiple to which you want to round. The number and significance must have the same sign.",
          ),
      }),
      execute: async ({ number, significance }) => {
        return formulajs.FLOOR(number, significance);
      },
    }),
    FLOORMATH: tool({
      description:
        "Rounds a number down to the nearest integer or to the nearest multiple of significance.",
      parameters: z.object({
        number: z.number().describe("The number you want to round."),
        significance: z
          .number()
          .optional()
          .describe(
            "Optional. The multiple to which you want to round. The number and significance must have the same sign.",
          ),
        mode: z
          .number()
          .optional()
          .describe(
            "Optional.  If number is negative, FLOORMATH rounds toward or away from zero. 0 (zero) or omitted rounds away from zero. Any other value rounds toward zero.",
          ),
      }),
      execute: async ({ number, significance, mode }) => {
        return formulajs.FLOORMATH(number, significance, mode);
      },
    }),
    FLOORPRECISE: tool({
      description:
        "Rounds a number down to the nearest integer or to the nearest multiple of significance.",
      parameters: z.object({
        number: z.number().describe("The number you want to round."),
        significance: z
          .number()
          .optional()
          .describe(
            "Optional. The multiple to which you want to round. The number and significance do not need to have the same sign.",
          ),
      }),
      execute: async ({ number, significance }) => {
        return formulajs.FLOORPRECISE(number, significance);
      },
    }),
    GCD: tool({
      description: "Returns the greatest common divisor of two or more integers.",
      parameters: z.object({
        number: z
          .array(z.number())
          .describe(
            "An array of numbers for which you want to calculate the greatest common divisor.",
          ),
      }),
      execute: async ({ number }) => {
        return formulajs.GCD(...number);
      },
    }),
    INT: tool({
      description: "Rounds a number down to the nearest integer.",
      parameters: z.object({
        number: z.number().describe("The number you want to round down to an integer."),
      }),
      execute: async ({ number }) => {
        return formulajs.INT(number);
      },
    }),
    ISEVEN: tool({
      description: "Checks whether a value is even, and returns TRUE or FALSE.",
      parameters: z.object({
        number: z.number().describe("The value to test."),
      }),
      execute: async ({ number }) => {
        return formulajs.ISEVEN(number);
      },
    }),
    ISODD: tool({
      description: "Checks whether a value is odd, and returns TRUE or FALSE.",
      parameters: z.object({
        number: z.number().describe("The value to test."),
      }),
      execute: async ({ number }) => {
        return formulajs.ISODD(number);
      },
    }),
    LCM: tool({
      description:
        "Returns the least common multiple of integers. The least common multiple is the smallest positive integer that is a multiple of all integer arguments number1, number2, and so on. Use LCM to add fractions with different denominators.",
      parameters: z.object({
        number: z
          .array(z.number())
          .describe(
            "An array of numbers for which you want to calculate the least common multiple.",
          ),
      }),
      execute: async ({ number }) => {
        return formulajs.LCM(...number);
      },
    }),
    LN: tool({
      description: "Returns the natural logarithm of a number.",
      parameters: z.object({
        number: z
          .number()
          .describe("The positive real number for which you want the natural logarithm."),
      }),
      execute: async ({ number }) => {
        return formulajs.LN(number);
      },
    }),
    LOG: tool({
      description: "Returns the logarithm of a number to the base you specify.",
      parameters: z.object({
        number: z
          .number()
          .describe("The positive real number for which you want the logarithm."),
        base: z.number().describe("The base of the logarithm."),
      }),
      execute: async ({ number, base }) => {
        return formulajs.LOG(number, base);
      },
    }),
    LOG10: tool({
      description: "Returns the base-10 logarithm of a number.",
      parameters: z.object({
        number: z
          .number()
          .describe("The positive real number for which you want the base-10 logarithm."),
      }),
      execute: async ({ number }) => {
        return formulajs.LOG10(number);
      },
    }),
    MOD: tool({
      description: "Returns the remainder after number is divided by divisor.",
      parameters: z.object({
        number: z
          .number()
          .describe("The number for which you want to find the remainder."),
        divisor: z.number().describe("The number by which you want to divide number."),
      }),
      execute: async ({ number, divisor }) => {
        return formulajs.MOD(number, divisor);
      },
    }),
    MROUND: tool({
      description: "Returns a number rounded to the desired multiple.",
      parameters: z.object({
        number: z.number().describe("The value to round."),
        multiple: z.number().describe("The multiple to which you want to round number."),
      }),
      execute: async ({ number, multiple }) => {
        return formulajs.MROUND(number, multiple);
      },
    }),
    MULTINOMIAL: tool({
      description:
        "Returns the ratio of factorials. MULTINOMIAL is (a+b+c+...)! / (a! * b! * c! * ...).",
      parameters: z.object({
        number: z
          .array(z.number())
          .describe(
            "An array of numbers for which you want to calculate the multinomial.",
          ),
      }),
      execute: async ({ number }) => {
        return formulajs.MULTINOMIAL(...number);
      },
    }),
    ODD: tool({
      description: "Rounds number up to the nearest odd integer.",
      parameters: z.object({
        number: z.number().describe("The value to round."),
      }),
      execute: async ({ number }) => {
        return formulajs.ODD(number);
      },
    }),
    POWER: tool({
      description: "Returns the result of a number raised to a power.",
      parameters: z.object({
        number: z.number().describe("The base number. It can be any real number."),
        power: z.number().describe("The exponent to which the base number is raised."),
      }),
      execute: async ({ number, power }) => {
        return formulajs.POWER(number, power);
      },
    }),
    PRODUCT: tool({
      description:
        "Multiplies all the numbers given as arguments and returns the product.",
      parameters: z.object({
        number: z
          .array(z.number())
          .describe("An array of numbers that you want to multiply."),
      }),
      execute: async ({ number }) => {
        return formulajs.PRODUCT(...number);
      },
    }),
    QUOTIENT: tool({
      description: "Returns the integer portion of a division.",
      parameters: z.object({
        numerator: z.number().describe("The numerator."),
        denominator: z.number().describe("The denominator."),
      }),
      execute: async ({ numerator, denominator }) => {
        return formulajs.QUOTIENT(numerator, denominator);
      },
    }),
    RADIANS: tool({
      description: "Converts degrees to radians.",
      parameters: z.object({
        angle: z
          .number()
          .describe("An angle in degrees that you want to convert to radians."),
      }),
      execute: async ({ angle }) => {
        return formulajs.RADIANS(angle);
      },
    }),
    RAND: tool({
      description:
        "Returns a random number greater than or equal to 0 and less than 1. A new random real number is returned every time a worksheet is calculated.",
      parameters: z.object({}),
      execute: async () => {
        return formulajs.RAND();
      },
    }),
    RANDBETWEEN: tool({
      description: "Returns a random integer number between the numbers you specify.",
      parameters: z.object({
        bottom: z.number().describe("The smallest integer RANDBETWEEN will return."),
        top: z.number().describe("The largest integer RANDBETWEEN will return."),
      }),
      execute: async ({ bottom, top }) => {
        return formulajs.RANDBETWEEN(bottom, top);
      },
    }),
    ROUND: tool({
      description: "Rounds a number to a specified number of digits.",
      parameters: z.object({
        number: z.number().describe("The number you want to round."),
        num_digits: z
          .number()
          .describe("The number of digits to which you want to round number."),
      }),
      execute: async ({ number, num_digits }) => {
        return formulajs.ROUND(number, num_digits);
      },
    }),
    ROUNDDOWN: tool({
      description: "Rounds a number down, toward zero.",
      parameters: z.object({
        number: z.number().describe("The number you want to round."),
        num_digits: z
          .number()
          .describe("The number of digits to which you want to round number."),
      }),
      execute: async ({ number, num_digits }) => {
        return formulajs.ROUNDDOWN(number, num_digits);
      },
    }),
    ROUNDUP: tool({
      description: "Rounds a number up, away from zero.",
      parameters: z.object({
        number: z.number().describe("The number you want to round."),
        num_digits: z
          .number()
          .describe("The number of digits to which you want to round number."),
      }),
      execute: async ({ number, num_digits }) => {
        return formulajs.ROUNDUP(number, num_digits);
      },
    }),
    SEC: tool({
      description: "Returns the secant of an angle.",
      parameters: z.object({
        number: z
          .number()
          .describe("The angle in radians for which you want the secant."),
      }),
      execute: async ({ number }) => {
        return formulajs.SEC(number);
      },
    }),
    SECH: tool({
      description: "Returns the hyperbolic secant of a number.",
      parameters: z.object({
        number: z
          .number()
          .describe(
            "Any real number for which you want to calculate the hyperbolic secant.",
          ),
      }),
      execute: async ({ number }) => {
        return formulajs.SECH(number);
      },
    }),
    SIGN: tool({
      description: "Returns the sign of a number.",
      parameters: z.object({
        number: z.number().describe("Any real number."),
      }),
      execute: async ({ number }) => {
        return formulajs.SIGN(number);
      },
    }),
    SIN: tool({
      description: "Returns the sine of the given angle.",
      parameters: z.object({
        number: z.number().describe("The angle in radians for which you want the sine."),
      }),
      execute: async ({ number }) => {
        return formulajs.SIN(number);
      },
    }),
    SINH: tool({
      description: "Returns the hyperbolic sine of a number.",
      parameters: z.object({
        number: z
          .number()
          .describe(
            "Any real number for which you want to calculate the hyperbolic sine.",
          ),
      }),
      execute: async ({ number }) => {
        return formulajs.SINH(number);
      },
    }),
    SQRT: tool({
      description: "Returns a positive square root.",
      parameters: z.object({
        number: z.number().describe("The number for which you want the square root."),
      }),
      execute: async ({ number }) => {
        return formulajs.SQRT(number);
      },
    }),
    SQRTPI: tool({
      description: "Returns the square root of (number * pi).",
      parameters: z.object({
        number: z.number().describe("The number by which pi is multiplied."),
      }),
      execute: async ({ number }) => {
        return formulajs.SQRTPI(number);
      },
    }),
    SUBTOTAL: tool({
      description: "Returns a subtotal in a list or database.",
      parameters: z.object({
        function_num: z
          .number()
          .describe(
            "A number from 1 to 11 or 101 to 111 specifying the function to use for the subtotal.",
          ),
        array: z
          .array(z.union([z.number(), z.string(), z.boolean()]))
          .describe("An array of numbers that you want to subtotal."),
      }),
      execute: async ({ function_num, array }) => {
        return formulajs.SUBTOTAL(function_num, array);
      },
    }),
    SUM: tool({
      description: "Adds all the numbers in a range of cells.",
      parameters: z.object({
        number: z.array(z.number()).describe("An array of numbers that you want to sum."),
      }),
      execute: async ({ number }) => {
        return formulajs.SUM(...number);
      },
    }),
    SUMIF: tool({
      description: "Adds the values in a range that meet criteria that you specify.",
      parameters: z.object({
        range: z
          .array(z.union([z.number(), z.string(), z.boolean()]))
          .describe("The range of cells that you want evaluated by criteria."),
        criteria: z
          .string()
          .describe(
            "The criteria in the form of a number, expression, a cell reference, text, or a function that defines which cells will be added.",
          ),
        sum_range: z
          .array(z.union([z.number(), z.string(), z.boolean()]))
          .optional()
          .describe(
            "The actual cells to sum. If sum_range is omitted, the cells in range are summed.",
          ),
      }),
      execute: async ({ range, criteria, sum_range }) => {
        return formulajs.SUMIF(range, criteria, sum_range);
      },
    }),
    SUMIFS: tool({
      description: "Adds the values in a range that meet multiple criteria.",
      parameters: z.object({
        sum_range: z
          .array(z.union([z.number(), z.string(), z.boolean()]))
          .describe(
            "One or more cells to sum. The first argument can be a range, a cell reference, or a name.",
          ),
        criteria_range: z
          .array(z.union([z.number(), z.string(), z.boolean()]))
          .describe("The range of cells that is evaluated."),
        criteria: z
          .array(z.string())
          .describe(
            "The criteria in the form of a number, expression, a cell reference, text, or a function that defines which cells will be added.",
          ),
      }),
      execute: async ({ sum_range, criteria_range, criteria }) => {
        return formulajs.SUMIFS(
          sum_range,
          ...criteria_range.map((range, index) => [range, criteria[index]]).flat(),
        );
      },
    }),
    SUMPRODUCT: tool({
      description:
        "Multiplies corresponding components in the given arrays, and returns the sum of those products.",
      parameters: z.object({
        array: z
          .array(z.union([z.number(), z.string(), z.boolean()]))
          .describe("An array of numbers that you want to multiply, then add."),
      }),
      execute: async ({ array }) => {
        return formulajs.SUMPRODUCT(...array);
      },
    }),
    SUMSQ: tool({
      description: "Returns the sum of the squares of the arguments.",
      parameters: z.object({
        number: z
          .array(z.number())
          .describe("An array of numbers that you want to square, then add."),
      }),
      execute: async ({ number }) => {
        return formulajs.SUMSQ(...number);
      },
    }),
    SUMX2MY2: tool({
      description:
        "Returns the sum of the difference of squares of corresponding values in two arrays.",
      parameters: z.object({
        array_x: z.array(z.number()).describe("The first array of values."),
        array_y: z.array(z.number()).describe("The second array of values."),
      }),
      execute: async ({ array_x, array_y }) => {
        return formulajs.SUMX2MY2(array_x, array_y);
      },
    }),
    SUMX2PY2: tool({
      description:
        "Returns the sum of the sum of squares of corresponding values in two arrays.",
      parameters: z.object({
        array_x: z.array(z.number()).describe("The first array of values."),
        array_y: z.array(z.number()).describe("The second array of values."),
      }),
      execute: async ({ array_x, array_y }) => {
        return formulajs.SUMX2PY2(array_x, array_y);
      },
    }),
    SUMXMY2: tool({
      description:
        "Returns the sum of squares of the differences of corresponding values in two arrays.",
      parameters: z.object({
        array_x: z.array(z.number()).describe("The first array of values."),
        array_y: z.array(z.number()).describe("The second array of values."),
      }),
      execute: async ({ array_x, array_y }) => {
        return formulajs.SUMXMY2(array_x, array_y);
      },
    }),
    TAN: tool({
      description: "Returns the tangent of the given angle.",
      parameters: z.object({
        number: z
          .number()
          .describe("The angle in radians for which you want the tangent."),
      }),
      execute: async ({ number }) => {
        return formulajs.TAN(number);
      },
    }),
    TANH: tool({
      description: "Returns the hyperbolic tangent of a number.",
      parameters: z.object({
        number: z.number().describe("Any real number."),
      }),
      execute: async ({ number }) => {
        return formulajs.TANH(number);
      },
    }),
    TRUNC: tool({
      description:
        "Truncates a number to an integer by removing the fractional, or decimal, part of the number.",
      parameters: z.object({
        number: z.number().describe("The number you want to truncate."),
        num_digits: z
          .number()
          .optional()
          .describe(
            "Optional. A number specifying the precision of the truncation. The default value for num_digits is 0 (zero).",
          ),
      }),
      execute: async ({ number, num_digits }) => {
        return formulajs.TRUNC(number, num_digits);
      },
    }),
    AVEDEV: tool({
      description:
        "Returns the average of the absolute deviations of data points from their mean. AVEDEV is a measure of the variability in a data set.",
      parameters: z.object({
        number: z
          .array(z.number())
          .describe(
            "An array of numbers for which you want to calculate the average of the absolute deviations.",
          ),
      }),
      execute: async ({ number }) => {
        return formulajs.AVEDEV(...number);
      },
    }),
    AVERAGE: tool({
      description: "Returns the average (arithmetic mean) of its arguments.",
      parameters: z.object({
        number: z
          .array(z.number())
          .describe("An array of numbers for which you want to calculate the average."),
      }),
      execute: async ({ number }) => {
        return formulajs.AVERAGE(...number);
      },
    }),
    AVERAGEA: tool({
      description:
        "Returns the average (arithmetic mean) of its arguments, including numbers, text, and logical values.",
      parameters: z.object({
        number: z
          .array(z.union([z.number(), z.string(), z.boolean()]))
          .describe("An array of values for which you want to calculate the average."),
      }),
      execute: async ({ number }) => {
        return formulajs.AVERAGEA(...number);
      },
    }),
    AVERAGEIF: tool({
      description:
        "Returns the average (arithmetic mean) of all the cells in a range that meet a given criteria.",
      parameters: z.object({
        range: z
          .array(z.union([z.number(), z.string(), z.boolean()]))
          .describe("The range of cells that you want evaluated by criteria."),
        criteria: z
          .string()
          .describe(
            "The criteria in the form of a number, expression, a cell reference, text, or a function that defines which cells will be averaged.",
          ),
        average_range: z
          .array(z.union([z.number(), z.string(), z.boolean()]))
          .optional()
          .describe(
            "The actual cells to average. If average_range is omitted, the cells in range are averaged.",
          ),
      }),
      execute: async ({ range, criteria, average_range }) => {
        return formulajs.AVERAGEIF(range, criteria, average_range);
      },
    }),
    AVERAGEIFS: tool({
      description:
        "Returns the average (arithmetic mean) of all cells that meet multiple criteria.",
      parameters: z.object({
        average_range: z
          .array(z.union([z.number(), z.string(), z.boolean()]))
          .describe(
            "One or more cells to average. The first argument can be a range, a cell reference, or a name.",
          ),
        criteria_range: z
          .array(z.union([z.number(), z.string(), z.boolean()]))
          .describe("The range of cells that is evaluated."),
        criteria: z
          .array(z.string())
          .describe(
            "The criteria in the form of a number, expression, a cell reference, text, or a function that defines which cells will be averaged.",
          ),
      }),
      execute: async ({ average_range, criteria_range, criteria }) => {
        return formulajs.AVERAGEIFS(
          average_range,
          ...criteria_range.map((range, index) => [range, criteria[index]]).flat(),
        );
      },
    }),
    BETADIST: tool({
      description: "Returns the beta cumulative distribution function.",
      parameters: z.object({
        x: z
          .number()
          .describe(
            "The value between alpha and beta at which to evaluate the function.",
          ),
        alpha: z.number().describe("A parameter to the distribution."),
        beta: z.number().describe("A parameter to the distribution."),
        cumulative: z
          .boolean()
          .describe(
            "A logical value that determines the form of the function. If cumulative is TRUE, BETADIST returns the cumulative distribution function; if FALSE, it returns the probability density function.",
          ),
        A: z
          .number()
          .optional()
          .describe("Optional. A lower bound to the interval of x."),
        B: z
          .number()
          .optional()
          .describe("Optional. An upper bound to the interval of x."),
      }),
      execute: async ({ x, alpha, beta, cumulative, A, B }) => {
        return formulajs.BETADIST(x, alpha, beta, cumulative, A, B);
      },
    }),
    BETAINV: tool({
      description: "Returns the inverse of the beta cumulative distribution function.",
      parameters: z.object({
        probability: z
          .number()
          .describe("A probability associated with the beta distribution."),
        alpha: z.number().describe("A parameter to the distribution."),
        beta: z.number().describe("A parameter to the distribution."),
        A: z
          .number()
          .optional()
          .describe("Optional. A lower bound to the interval of x."),
        B: z
          .number()
          .optional()
          .describe("Optional. An upper bound to the interval of x."),
      }),
      execute: async ({ probability, alpha, beta, A, B }) => {
        return formulajs.BETAINV(probability, alpha, beta, A, B);
      },
    }),
    BINOMDIST: tool({
      description: "Returns the individual term binomial distribution probability.",
      parameters: z.object({
        number_s: z.number().describe("The number of successes in trials."),
        trials: z.number().describe("The number of independent trials."),
        probability_s: z.number().describe("The probability of success on each trial."),
        cumulative: z
          .boolean()
          .describe(
            "A logical value that determines the form of the function. If cumulative is TRUE, BINOMDIST returns the cumulative distribution function, which is the probability that there are at most number_s successes; if FALSE, it returns the probability mass function, which is the probability that there are exactly number_s successes.",
          ),
      }),
      execute: async ({ number_s, trials, probability_s, cumulative }) => {
        return formulajs.BINOMDIST(number_s, trials, probability_s, cumulative);
      },
    }),
    CORREL: tool({
      description: "Returns the correlation coefficient between two data sets.",
      parameters: z.object({
        array1: z.array(z.number()).describe("The first array of data."),
        array2: z.array(z.number()).describe("The second array of data."),
      }),
      execute: async ({ array1, array2 }) => {
        return formulajs.CORREL(array1, array2);
      },
    }),
    COUNT: tool({
      description: "Counts the number of cells that contain numbers.",
      parameters: z.object({
        value: z
          .array(z.union([z.number(), z.string(), z.boolean()]))
          .describe("An array of values that you want to count."),
      }),
      execute: async ({ value }) => {
        return formulajs.COUNT(...value);
      },
    }),
    COUNTA: tool({
      description: "Counts the number of cells that are not empty.",
      parameters: z.object({
        value: z
          .array(z.union([z.number(), z.string(), z.boolean()]))
          .describe("An array of values that you want to count."),
      }),
      execute: async ({ value }) => {
        return formulajs.COUNTA(...value);
      },
    }),
    COUNTBLANK: tool({
      description: "Counts the number of empty cells in a range.",
      parameters: z.object({
        range: z
          .array(z.union([z.number(), z.string(), z.boolean()]))
          .describe("The range from which you want to count the blank cells."),
      }),
      execute: async ({ range }) => {
        return formulajs.COUNTBLANK(...range);
      },
    }),
    COUNTIF: tool({
      description:
        "Counts the number of cells within a range that meet the given criteria.",
      parameters: z.object({
        range: z
          .array(z.union([z.number(), z.string(), z.boolean()]))
          .describe("The range of cells that you want evaluated by criteria."),
        criteria: z
          .string()
          .describe(
            "The criteria in the form of a number, expression, a cell reference, text, or a function that defines which cells will be counted.",
          ),
      }),
      execute: async ({ range, criteria }) => {
        return formulajs.COUNTIF(range, criteria);
      },
    }),
    COUNTIFS: tool({
      description:
        "Counts the number of cells within a range that meet multiple criteria.",
      parameters: z.object({
        criteria_range: z
          .array(z.union([z.number(), z.string(), z.boolean()]))
          .describe("The range of cells that is evaluated."),
        criteria: z
          .array(z.string())
          .describe(
            "The criteria in the form of a number, expression, a cell reference, text, or a function that defines which cells will be counted.",
          ),
      }),
      execute: async ({ criteria_range, criteria }) => {
        return formulajs.COUNTIFS(
          ...criteria_range.map((range, index) => [range, criteria[index]]).flat(),
        );
      },
    }),

    COVARIANCEP: tool({
      description:
        "Returns covariance, the average of the products of deviations for each data point pair in two data sets.",
      parameters: z.object({
        array1: z.array(z.number()).describe("The first range of cells."),
        array2: z.array(z.number()).describe("The second range of cells."),
      }),
      execute: async ({ array1, array2 }) => {
        return formulajs.COVARIANCEP(array1, array2);
      },
    }),
    COVARIANCES: tool({
      description:
        "Returns the sample covariance, the average of the products of deviations for each data point pair in two data sets.",
      parameters: z.object({
        array1: z.array(z.number()).describe("The first range of cells."),
        array2: z.array(z.number()).describe("The second range of cells."),
      }),
      execute: async ({ array1, array2 }) => {
        return formulajs.COVARIANCES(array1, array2);
      },
    }),
    DEVSQ: tool({
      description: "Returns the sum of squares of deviations.",
      parameters: z.object({
        number: z
          .array(z.number())
          .describe(
            "An array of numbers for which you want to calculate the sum of squares of deviations.",
          ),
      }),
      execute: async ({ number }) => {
        return formulajs.DEVSQ(...number);
      },
    }),
    EXPONDIST: tool({
      description: "Returns the exponential distribution.",
      parameters: z.object({
        x: z.number().describe("The value of the function."),
        lambda: z.number().describe("The parameter value."),
        cumulative: z
          .boolean()
          .describe(
            "A logical value that determines the form of the function. If cumulative is TRUE, EXPONDIST returns the cumulative distribution function; if FALSE, it returns the probability density function.",
          ),
      }),
      execute: async ({ x, lambda, cumulative }) => {
        return formulajs.EXPONDIST(x, lambda, cumulative);
      },
    }),
    FDIST: tool({
      description: "Returns the F probability distribution.",
      parameters: z.object({
        x: z.number().describe("The value at which to evaluate the distribution."),
        degrees_freedom1: z.number().describe("The numerator degrees of freedom."),
        degrees_freedom2: z.number().describe("The denominator degrees of freedom."),
        cumulative: z
          .boolean()
          .describe(
            "A logical value that determines the form of the function. If cumulative is TRUE, FDIST returns the cumulative distribution function; if FALSE, it returns the probability density function.",
          ),
      }),
      execute: async ({ x, degrees_freedom1, degrees_freedom2, cumulative }) => {
        return formulajs.FDIST(x, degrees_freedom1, degrees_freedom2, cumulative);
      },
    }),
    FINV: tool({
      description: "Returns the inverse of the F probability distribution.",
      parameters: z.object({
        probability: z
          .number()
          .describe("A probability associated with the F cumulative distribution."),
        degrees_freedom1: z.number().describe("The numerator degrees of freedom."),
        degrees_freedom2: z.number().describe("The denominator degrees of freedom."),
      }),
      execute: async ({ probability, degrees_freedom1, degrees_freedom2 }) => {
        return formulajs.FINV(probability, degrees_freedom1, degrees_freedom2);
      },
    }),
    FISHER: tool({
      description: "Returns the Fisher transformation at x.",
      parameters: z.object({
        x: z.number().describe("A numeric value for which you want the transformation."),
      }),
      execute: async ({ x }) => {
        return formulajs.FISHER(x);
      },
    }),
    FISHERINV: tool({
      description: "Returns the inverse of the Fisher transformation.",
      parameters: z.object({
        y: z
          .number()
          .describe("A numeric value for which you want the inverse transformation."),
      }),
      execute: async ({ y }) => {
        return formulajs.FISHERINV(y);
      },
    }),
    FORECAST: tool({
      description: "Calculates, or predicts, a future value by using existing values.",
      parameters: z.object({
        x: z.number().describe("The data point for which you want to predict a value."),
        known_y: z.array(z.number()).describe("The dependent range of data."),
        known_x: z.array(z.number()).describe("The independent range of data."),
      }),
      execute: async ({ x, known_y, known_x }) => {
        return formulajs.FORECAST(x, known_y, known_x);
      },
    }),
    FREQUENCY: tool({
      description:
        "Calculates how often values occur within a range of values, and then returns a vertical array of numbers.",
      parameters: z.object({
        data_array: z
          .array(z.number())
          .describe(
            "An array of or reference to a set of values for which you want to count frequencies.",
          ),
        bins_array: z
          .array(z.number())
          .describe(
            "An array of or reference to intervals into which you want to group the values in data_array.",
          ),
      }),
      execute: async ({ data_array, bins_array }) => {
        return formulajs.FREQUENCY(data_array, bins_array);
      },
    }),
    GAMMA: tool({
      description: "Returns the Gamma function value.",
      parameters: z.object({
        x: z
          .number()
          .describe("A number for which you want to evaluate Gamma. x must be positive."),
      }),
      execute: async ({ x }) => {
        return formulajs.GAMMA(x);
      },
    }),
    GAMMALN: tool({
      description: "Returns the natural logarithm of the gamma function, Γ(x).",
      parameters: z.object({
        x: z
          .number()
          .describe(
            "A value for which you want to calculate GAMMALN. If number is not numeric, GAMMALN returns the #VALUE! error value.",
          ),
      }),
      execute: async ({ x }) => {
        return formulajs.GAMMALN(x);
      },
    }),
    GAUSS: tool({
      description: "Returns 0.5 less than the standard normal cumulative distribution.",
      parameters: z.object({
        x: z.number().describe("The value for which you want to calculate GAUSS."),
      }),
      execute: async ({ x }) => {
        return formulajs.GAUSS(x);
      },
    }),
    GEOMEAN: tool({
      description: "Returns the geometric mean of an array or range of positive data.",
      parameters: z.object({
        number: z
          .array(z.number())
          .describe(
            "An array of numbers for which you want to calculate the geometric mean.",
          ),
      }),
      execute: async ({ number }) => {
        return formulajs.GEOMEAN(...number);
      },
    }),
    GROWTH: tool({
      description:
        "Returns an array of predicted y-values for the range of new x-values.",
      parameters: z.object({
        known_y: z
          .array(z.number())
          .describe(
            "The set of y-values you already know in the relationship y = b*m^x.",
          ),
        known_x: z
          .array(z.number())
          .optional()
          .describe(
            "An optional set of x-values that you may already know in the relationship y = b*m^x.",
          ),
        new_x: z
          .array(z.number())
          .optional()
          .describe(
            "Optional new x-values for which you want GROWTH to return corresponding y-values.",
          ),
      }),
      execute: async ({ known_y, known_x, new_x }) => {
        return formulajs.GROWTH(known_y, known_x, new_x, undefined);
      },
    }),
    HARMEAN: tool({
      description: "Returns the harmonic mean of a data set.",
      parameters: z.object({
        number: z
          .array(z.number())
          .describe(
            "An array of numbers for which you want to calculate the harmonic mean.",
          ),
      }),
      execute: async ({ number }) => {
        return formulajs.HARMEAN(...number);
      },
    }),
    HYPGEOMDIST: tool({
      description:
        "Returns the hypergeometric distribution. HYPGEOMDIST returns the probability of a given number of sample successes, given the sample size, population successes, and population size.",
      parameters: z.object({
        sample_s: z.number().describe("The number of successes in the sample."),
        number_sample: z.number().describe("The size of the sample."),
        population_s: z.number().describe("The number of successes in the population."),
        number_population: z.number().describe("The size of the population."),
        cumulative: z
          .boolean()
          .describe(
            "A logical value that determines the form of the function. If cumulative is TRUE, HYPGEOMDIST returns the cumulative distribution function; if FALSE, it returns the probability mass function.",
          ),
      }),
      execute: async ({
        sample_s,
        number_sample,
        population_s,
        number_population,
        cumulative,
      }) => {
        return formulajs.HYPGEOMDIST(
          sample_s,
          number_sample,
          population_s,
          number_population,
          cumulative,
        );
      },
    }),
    INTERCEPT: tool({
      description:
        "Calculates the point at which a line will intersect the y-axis by using existing x-values and y-values.",
      parameters: z.object({
        known_y: z.array(z.number()).describe("The set of dependent y-values."),
        known_x: z.array(z.number()).describe("The set of independent x-values."),
      }),
      execute: async ({ known_y, known_x }) => {
        return formulajs.INTERCEPT(known_y, known_x);
      },
    }),
    KURT: tool({
      description: "Returns the kurtosis of a data set.",
      parameters: z.object({
        number: z
          .array(z.number())
          .describe("An array of numbers for which you want to calculate the kurtosis."),
      }),
      execute: async ({ number }) => {
        return formulajs.KURT(...number);
      },
    }),
    LARGE: tool({
      description: "Returns the k-th largest value in a data set.",
      parameters: z.object({
        array: z
          .array(z.number())
          .describe(
            "The array or range of data for which you want to determine the k-th largest value.",
          ),
        k: z.number().describe("The k-th largest value to return."),
      }),
      execute: async ({ array, k }) => {
        return formulajs.LARGE(array, k);
      },
    }),
    LINEST: tool({
      description:
        "Calculates the statistics for a line by using the 'least squares' method to calculate a straight line that best fits your data, and returns an array that describes the line.",
      parameters: z.object({
        known_y: z
          .array(z.number())
          .describe(
            "The set of y-values you already know in the relationship y = b*m^x.",
          ),
        known_x: z
          .array(z.number())
          .optional()
          .describe(
            "An optional set of x-values that you may already know in the relationship y = b*m^x.",
          ),
      }),
      execute: async ({ known_y, known_x }) => {
        return formulajs.LINEST(known_y, known_x);
      },
    }),
    LOGNORMINV: tool({
      description:
        "Returns the inverse of the lognormal cumulative distribution function.",
      parameters: z.object({
        probability: z
          .number()
          .describe("A probability associated with the lognormal distribution."),
        mean: z.number().describe("The mean of ln(x)."),
        standard_dev: z.number().describe("The standard deviation of ln(x)."),
      }),
      execute: async ({ probability, mean, standard_dev }) => {
        return formulajs.LOGNORMINV(probability, mean, standard_dev);
      },
    }),
    MAX: tool({
      description: "Returns the largest value in a set of values.",
      parameters: z.object({
        number: z
          .array(z.number())
          .describe(
            "An array of numbers for which you want to calculate the largest value.",
          ),
      }),
      execute: async ({ number }) => {
        return formulajs.MAX(...number);
      },
    }),
    MAXA: tool({
      description:
        "Returns the largest value in a list of arguments, including numbers, text, and logical values.",
      parameters: z.object({
        number: z
          .array(z.union([z.number(), z.string(), z.boolean()]))
          .describe(
            "An array of values for which you want to calculate the largest value.",
          ),
      }),
      execute: async ({ number }) => {
        return formulajs.MAXA(...number);
      },
    }),
    MEDIAN: tool({
      description: "Returns the median of the given numbers.",
      parameters: z.object({
        number: z
          .array(z.number())
          .describe("An array of numbers for which you want to calculate the median."),
      }),
      execute: async ({ number }) => {
        return formulajs.MEDIAN(...number);
      },
    }),
    MIN: tool({
      description: "Returns the smallest number in a set of values.",
      parameters: z.object({
        number: z
          .array(z.number())
          .describe(
            "An array of numbers for which you want to calculate the smallest value.",
          ),
      }),
      execute: async ({ number }) => {
        return formulajs.MIN(...number);
      },
    }),
    MINA: tool({
      description:
        "Returns the smallest value in a list of arguments, including numbers, text, and logical values.",
      parameters: z.object({
        number: z
          .array(z.union([z.number(), z.string(), z.boolean()]))
          .describe(
            "An array of values for which you want to calculate the smallest value.",
          ),
      }),
      execute: async ({ number }) => {
        return formulajs.MINA(...number);
      },
    }),
    MODEMULT: tool({
      description:
        "Returns a vertical array of the most frequently occurring, or repetitive, values in an array or range of data.",
      parameters: z.object({
        number: z
          .array(z.number())
          .describe("An array of numbers for which you want to calculate the mode."),
      }),
      execute: async ({ number }) => {
        return formulajs.MODEMULT(...number);
      },
    }),
    MODESNGL: tool({
      description:
        "Returns the most frequently occurring, or repetitive, value in an array or range of data.",
      parameters: z.object({
        number: z
          .array(z.number())
          .describe("An array of numbers for which you want to calculate the mode."),
      }),
      execute: async ({ number }) => {
        return formulajs.MODESNGL(...number);
      },
    }),
    NORMDIST: tool({
      description:
        "Returns the normal cumulative distribution for the specified mean and standard deviation.",
      parameters: z.object({
        x: z.number().describe("The value for which you want the distribution."),
        mean: z.number().describe("The arithmetic mean of the distribution."),
        standard_dev: z.number().describe("The standard deviation of the distribution."),
        cumulative: z
          .boolean()
          .describe(
            "A logical value that determines the form of the function. If cumulative is TRUE, NORMDIST returns the cumulative distribution function; if FALSE, it returns the probability density function.",
          ),
      }),
      execute: async ({ x, mean, standard_dev, cumulative }) => {
        return formulajs.NORMDIST(x, mean, standard_dev, cumulative);
      },
    }),
    NORMINV: tool({
      description:
        "Returns the inverse of the normal cumulative distribution for the specified mean and standard deviation.",
      parameters: z.object({
        probability: z
          .number()
          .describe("A probability corresponding to the normal distribution."),
        mean: z.number().describe("The arithmetic mean of the distribution."),
        standard_dev: z.number().describe("The standard deviation of the distribution."),
      }),
      execute: async ({ probability, mean, standard_dev }) => {
        return formulajs.NORMINV(probability, mean, standard_dev);
      },
    }),
    NORMSDIST: tool({
      description:
        "Returns the standard normal cumulative distribution function. The distribution has a mean of 0 (zero) and a standard deviation of one.",
      parameters: z.object({
        z: z.number().describe("The value for which you want the distribution."),
        cumulative: z
          .boolean()
          .describe(
            "A logical value that determines the form of the function. If cumulative is TRUE, NORMSDIST returns the cumulative distribution function; if FALSE, it returns the probability density function.",
          ),
      }),
      execute: async ({ z, cumulative }) => {
        return formulajs.NORMSDIST(z, cumulative);
      },
    }),
    NORMSINV: tool({
      description: "Returns the inverse of the standard normal cumulative distribution.",
      parameters: z.object({
        probability: z
          .number()
          .describe("A probability corresponding to the normal distribution."),
      }),
      execute: async ({ probability }) => {
        return formulajs.NORMSINV(probability);
      },
    }),
    PEARSON: tool({
      description:
        "Returns the Pearson product moment correlation coefficient, r, a dimensionless index that ranges from -1.0 to +1.0 inclusive and reflects the extent of a linear relationship between two data sets.",
      parameters: z.object({
        array1: z.array(z.number()).describe("The first set of observations."),
        array2: z.array(z.number()).describe("The second set of observations."),
      }),
      execute: async ({ array1, array2 }) => {
        return formulajs.PEARSON(array1, array2);
      },
    }),
    PERCENTILEEXC: tool({
      description:
        "Returns the k-th percentile of values in a range, where k is in the exclusive range of 0..1.",
      parameters: z.object({
        array: z
          .array(z.number())
          .describe(
            "The array or range of data for which you want to determine the percentile.",
          ),
        k: z.number().describe("The percentile value in the exclusive range 0..1."),
      }),
      execute: async ({ array, k }) => {
        return formulajs.PERCENTILEEXC(array, k);
      },
    }),
    PERCENTILEINC: tool({
      description: "Returns the k-th percentile of values in a range.",
      parameters: z.object({
        array: z
          .array(z.number())
          .describe(
            "The array or range of data for which you want to determine the percentile.",
          ),
        k: z.number().describe("The percentile value in the range 0..1, inclusive."),
      }),
      execute: async ({ array, k }) => {
        return formulajs.PERCENTILEINC(array, k);
      },
    }),
    PERCENTRANKEXC: tool({
      description:
        "Returns the rank of a value in a data set as a percentage (0..1 exclusive) of the data set.",
      parameters: z.object({
        array: z
          .array(z.number())
          .describe(
            "The array or range of data with numeric values that defines relative standing.",
          ),
        x: z.number().describe("The value for which you want to know the rank."),
        significance: z
          .number()
          .optional()
          .describe(
            "Optional. A value that identifies the number of significant digits for the returned percentage value. If omitted, PERCENTRANK.EXC uses three digits (0.xxx).",
          ),
      }),
      execute: async ({ array, x, significance }) => {
        return formulajs.PERCENTRANKEXC(array, x, significance);
      },
    }),
    PERCENTRANKINC: tool({
      description:
        "Returns the rank of a value in a data set as a percentage (0..1 inclusive) of the data set.",
      parameters: z.object({
        array: z
          .array(z.number())
          .describe(
            "The array or range of data with numeric values that defines relative standing.",
          ),
        x: z.number().describe("The value for which you want to know the rank."),
        significance: z
          .number()
          .optional()
          .describe(
            "Optional. A value that identifies the number of significant digits for the returned percentage value. If omitted, PERCENTRANK.INC uses three digits (0.xxx).",
          ),
      }),
      execute: async ({ array, x, significance }) => {
        return formulajs.PERCENTRANKINC(array, x, significance);
      },
    }),
    PERMUT: tool({
      description:
        "Returns the number of permutations for a given number of objects that can be selected from number objects.",
      parameters: z.object({
        number: z.number().describe("An integer describing the total number of objects."),
        number_chosen: z
          .number()
          .describe("An integer describing the number of objects in each permutation."),
      }),
      execute: async ({ number, number_chosen }) => {
        return formulajs.PERMUT(number, number_chosen);
      },
    }),
    PERMUTATIONA: tool({
      description:
        "Returns the number of permutations for a given number of objects that can be selected from number objects, including repetitions.",
      parameters: z.object({
        number: z.number().describe("An integer describing the total number of objects."),
        number_chosen: z
          .number()
          .describe("An integer describing the number of objects in each permutation."),
      }),
      execute: async ({ number, number_chosen }) => {
        return formulajs.PERMUTATIONA(number, number_chosen);
      },
    }),
    PHI: tool({
      description:
        "Returns the value of the density function for a standard normal distribution.",
      parameters: z.object({
        x: z
          .number()
          .describe("The value at which you want to evaluate the density function."),
      }),
      execute: async ({ x }) => {
        return formulajs.PHI(x);
      },
    }),
    POISSONDIST: tool({
      description: "Returns the Poisson distribution.",
      parameters: z.object({
        x: z.number().describe("The number of events."),
        mean: z.number().describe("The expected number of events."),
        cumulative: z
          .boolean()
          .describe(
            "A logical value that determines the form of the function. If cumulative is TRUE, POISSONDIST returns the cumulative Poisson probability; if FALSE, it returns the Poisson probability mass function.",
          ),
      }),
      execute: async ({ x, mean, cumulative }) => {
        return formulajs.POISSONDIST(x, mean, cumulative);
      },
    }),
    PROB: tool({
      description:
        "Returns the probability that values in a range are between two limits.",
      parameters: z.object({
        range: z
          .array(z.number())
          .describe(
            "A range of numeric values for which you want to obtain probabilities.",
          ),
        probs_range: z
          .array(z.number())
          .describe("A range of probabilities associated with values in range."),
        lower_limit: z
          .number()
          .describe(
            "The lower bound on the value for which you want to calculate a probability.",
          ),
        upper_limit: z
          .number()
          .describe(
            "The upper bound on the value for which you want to calculate a probability.",
          ),
      }),
      execute: async ({ range, probs_range, lower_limit, upper_limit }) => {
        return formulajs.PROB(range, probs_range, lower_limit, upper_limit);
      },
    }),
    QUARTILEEXC: tool({
      description:
        "Returns the quartile of a data set, based on percentile values from 0..1 exclusive.",
      parameters: z.object({
        array: z
          .array(z.number())
          .describe(
            "The array or range of data for which you want to determine the quartile.",
          ),
        quart: z
          .number()
          .describe(
            "Indicates which value to return. 1 returns the first quartile (25th percentile); 2 returns the second quartile (the median, 50th percentile); 3 returns the third quartile (75th percentile).",
          ),
      }),
      execute: async ({ array, quart }) => {
        return formulajs.QUARTILEEXC(array, quart);
      },
    }),
    QUARTILEINC: tool({
      description: "Returns the quartile of a data set.",
      parameters: z.object({
        array: z
          .array(z.number())
          .describe(
            "The array or range of data for which you want to determine the quartile.",
          ),
        quart: z
          .number()
          .describe(
            "Indicates which value to return. 0 returns the minimum value; 1 returns the first quartile (25th percentile); 2 returns the second quartile (the median, 50th percentile); 3 returns the third quartile (75th percentile); 4 returns the maximum value.",
          ),
      }),
      execute: async ({ array, quart }) => {
        return formulajs.QUARTILEINC(array, quart);
      },
    }),
    RANKAVG: tool({
      description: "Returns the rank of a number in a list of numbers.",
      parameters: z.object({
        number: z.number().describe("The number for which you want to find the rank."),
        ref: z.array(z.number()).describe("An array of numbers to rank against."),
        order: z
          .boolean()
          .optional()
          .describe(
            "Optional. A number specifying how to rank number.If order is 0 or omitted, number is ranked as if ref were a list sorted in descending order.If order is any nonzero value, number is ranked as if ref were a list sorted in ascending order.",
          ),
      }),
      execute: async ({ number, ref, order }) => {
        return formulajs.RANKAVG(number, ref, order);
      },
    }),
    RANKEQ: tool({
      description: "Returns the rank of a number in a list of numbers.",
      parameters: z.object({
        number: z.number().describe("The number for which you want to find the rank."),
        ref: z.array(z.number()).describe("An array of numbers to rank against."),
        order: z
          .boolean()
          .optional()
          .describe(
            "Optional. A number specifying how to rank number.If order is 0 or omitted, number is ranked as if ref were a list sorted in descending order.If order is any nonzero value, number is ranked as if ref were a list sorted in ascending order.",
          ),
      }),
      execute: async ({ number, ref, order }) => {
        return formulajs.RANKEQ(number, ref, order);
      },
    }),
    RSQ: tool({
      description:
        "Returns the square of the Pearson product moment correlation coefficient through data points in known_y's and known_x's.",
      parameters: z.object({
        known_y: z.array(z.number()).describe("An array of dependent data points."),
        known_x: z.array(z.number()).describe("An array of independent data points."),
      }),
      execute: async ({ known_y, known_x }) => {
        return formulajs.RSQ(known_y, known_x);
      },
    }),
    SKEW: tool({
      description: "Returns the skewness of a distribution.",
      parameters: z.object({
        number: z
          .array(z.number())
          .describe("An array of numbers for which you want to calculate the skewness."),
      }),
      execute: async ({ number }) => {
        return formulajs.SKEW(...number);
      },
    }),
    SKEWP: tool({
      description: "Returns the skewness of a distribution based on a population.",
      parameters: z.object({
        number: z
          .array(z.number())
          .describe("An array of numbers for which you want to calculate the skewness."),
      }),
      execute: async ({ number }) => {
        return formulajs.SKEWP(...number);
      },
    }),
    SLOPE: tool({
      description:
        "Calculates the slope of the linear regression line through data points in known_y's and known_x's.",
      parameters: z.object({
        known_y: z.array(z.number()).describe("The array of dependent data points."),
        known_x: z.array(z.number()).describe("The array of independent data points."),
      }),
      execute: async ({ known_y, known_x }) => {
        return formulajs.SLOPE(known_y, known_x);
      },
    }),
    SMALL: tool({
      description: "Returns the k-th smallest value in a data set.",
      parameters: z.object({
        array: z
          .array(z.number())
          .describe(
            "The array or range of data for which you want to determine the k-th smallest value.",
          ),
        k: z.number().describe("The k-th smallest value to return."),
      }),
      execute: async ({ array, k }) => {
        return formulajs.SMALL(array, k);
      },
    }),
    STANDARDIZE: tool({
      description:
        "Returns a normalized value from a distribution characterized by mean and standard deviation.",
      parameters: z.object({
        x: z.number().describe("The value you want to normalize."),
        mean: z.number().describe("The arithmetic mean of the distribution."),
        standard_dev: z.number().describe("The standard deviation of the distribution."),
      }),
      execute: async ({ x, mean, standard_dev }) => {
        return formulajs.STANDARDIZE(x, mean, standard_dev);
      },
    }),
    STDEVA: tool({
      description:
        "Estimates standard deviation based on a sample. The standard deviation is a measure of how widely dispersed the values are from the average value (the mean).",
      parameters: z.object({
        value: z
          .array(z.union([z.number(), z.string(), z.boolean()]))
          .describe("An array of values that represents a sample of a population."),
      }),
      execute: async ({ value }) => {
        return formulajs.STDEVA(...value);
      },
    }),
    STDEVP: tool({
      description:
        "Calculates standard deviation based on the entire population given as arguments.",
      parameters: z.object({
        number: z
          .array(z.number())
          .describe("An array of numbers that represents the entire population."),
      }),
      execute: async ({ number }) => {
        return formulajs.STDEVP(...number);
      },
    }),
    STDEVPA: tool({
      description:
        "Calculates standard deviation based on the entire population given as arguments, including numbers, text, and logical values.",
      parameters: z.object({
        value: z
          .array(z.union([z.number(), z.string(), z.boolean()]))
          .describe("An array of values that represents the entire population."),
      }),
      execute: async ({ value }) => {
        return formulajs.STDEVPA(...value);
      },
    }),
    STDEVS: tool({
      description:
        "Estimates standard deviation based on a sample. The standard deviation is a measure of how widely dispersed the values are from the average value (the mean).",
      parameters: z.object({
        number: z
          .array(z.number())
          .describe("An array of numbers that represents a sample of a population."),
      }),
      execute: async ({ number }) => {
        return formulajs.STDEVS(...number);
      },
    }),
    STEYX: tool({
      description:
        "Returns the standard error of the predicted y-value for each x in the regression.",
      parameters: z.object({
        known_y: z.array(z.number()).describe("An array of dependent data points."),
        known_x: z.array(z.number()).describe("An array of independent data points."),
      }),
      execute: async ({ known_y, known_x }) => {
        return formulajs.STEYX(known_y, known_x);
      },
    }),
    TDIST: tool({
      description: "Returns the Student's t-distribution.",
      parameters: z.object({
        x: z
          .number()
          .describe("The numeric value at which to evaluate the distribution."),
        degrees_freedom: z
          .number()
          .describe(
            "An integer indicating the number of degrees of freedom to characterize the distribution.",
          ),
        cumulative: z
          .boolean()
          .describe(
            "A logical value that determines the form of the function. If cumulative is TRUE, TDIST returns the cumulative distribution function; if FALSE, it returns the probability density function.",
          ),
      }),
      execute: async ({ x, degrees_freedom, cumulative }) => {
        return formulajs.TDIST(x, degrees_freedom, cumulative);
      },
    }),
    TINV: tool({
      description:
        "Returns the t-value of the Student's t-distribution as a function of the probability and the degrees of freedom.",
      parameters: z.object({
        probability: z
          .number()
          .describe(
            "A probability corresponding to the two-tailed Student's t-distribution.",
          ),
        degrees_freedom: z
          .number()
          .describe(
            "The number of degrees of freedom with which to characterize the distribution.",
          ),
      }),
      execute: async ({ probability, degrees_freedom }) => {
        return formulajs.TINV(probability, degrees_freedom);
      },
    }),
    TRIMMEAN: tool({
      description: "Returns the mean of the interior of a data set.",
      parameters: z.object({
        array: z
          .array(z.number())
          .describe("The array of data from which to trim and average."),
        percent: z
          .number()
          .describe(
            "The fractional number of data points to exclude from the top and bottom of the data set.",
          ),
      }),
      execute: async ({ array, percent }) => {
        return formulajs.TRIMMEAN(array, percent);
      },
    }),
    VARA: tool({
      description:
        "Estimates variance based on a sample. The variance is a measure of how widely dispersed the values are from the average value (the mean).",
      parameters: z.object({
        value: z
          .array(z.union([z.number(), z.string(), z.boolean()]))
          .describe("An array of values that represents a sample of a population."),
      }),
      execute: async ({ value }) => {
        return formulajs.VARA(...value);
      },
    }),
    VARP: tool({
      description: "Calculates variance based on the entire population.",
      parameters: z.object({
        number: z
          .array(z.number())
          .describe("An array of numbers that represents the entire population."),
      }),
      execute: async ({ number }) => {
        return formulajs.VARP(...number);
      },
    }),
    VARPA: tool({
      description:
        "Calculates variance based on the entire population, including numbers, text, and logical values.",
      parameters: z.object({
        value: z
          .array(z.union([z.number(), z.string(), z.boolean()]))
          .describe("An array of values that represents the entire population."),
      }),
      execute: async ({ value }) => {
        return formulajs.VARPA(...value);
      },
    }),
    VARS: tool({
      description:
        "Estimates variance based on a sample. The variance is a measure of how widely dispersed the values are from the average value (the mean).",
      parameters: z.object({
        number: z
          .array(z.number())
          .describe("An array of numbers that represents a sample of a population."),
      }),
      execute: async ({ number }) => {
        return formulajs.VARS(...number);
      },
    }),
    WEIBULLDIST: tool({
      description: "Returns the Weibull distribution.",
      parameters: z.object({
        x: z.number().describe("The value at which to evaluate the function."),
        alpha: z.number().describe("A parameter to the Weibull distribution."),
        beta: z.number().describe("A parameter to the Weibull distribution."),
        cumulative: z
          .boolean()
          .describe(
            "A logical value that determines the form of the function. If cumulative is TRUE, WEIBULLDIST returns the cumulative distribution function; if FALSE, it returns the probability density function.",
          ),
      }),
      execute: async ({ x, alpha, beta, cumulative }) => {
        return formulajs.WEIBULLDIST(x, alpha, beta, cumulative);
      },
    }),
    ZTEST: tool({
      description: "Returns the one-tailed P-value of a z-test.",
      parameters: z.object({
        array: z.array(z.number()).describe("The array of data against which to test x."),
        x: z.number().describe("The value to test."),
        sigma: z
          .number()
          .optional()
          .describe(
            "Optional. The population standard deviation. If omitted, Z.TEST uses the sample standard deviation.",
          ),
      }),
      execute: async ({ array, x, sigma }) => {
        return formulajs.ZTEST(array, x, sigma);
      },
    }),
    CHAR: tool({
      description:
        "Returns the character specified by the code number from the character set for your computer.",
      parameters: z.object({
        number: z
          .number()
          .describe("A number between 1 and 255 specifying which character you want."),
      }),
      execute: async ({ number }) => {
        return formulajs.CHAR(number);
      },
    }),
    CLEAN: tool({
      description: "Removes all nonprintable characters from text.",
      parameters: z.object({
        text: z
          .string()
          .describe(
            "Any worksheet information from which you want to remove nonprintable characters.",
          ),
      }),
      execute: async ({ text }) => {
        return formulajs.CLEAN(text);
      },
    }),
    CODE: tool({
      description: "Returns a numeric code for the first character in a text string.",
      parameters: z.object({
        text: z
          .string()
          .describe("The text for which you want the code of the first character."),
      }),
      execute: async ({ text }) => {
        return formulajs.CODE(text);
      },
    }),
    CONCATENATE: tool({
      description: "Joins several text strings into one text string.",
      parameters: z.object({
        text: z.array(z.string()).describe("Text items to be joined together."),
      }),
      execute: async ({ text }) => {
        return formulajs.CONCATENATE(...text);
      },
    }),
    EXACT: tool({
      description:
        "Checks whether two text strings are exactly the same, and returns TRUE or FALSE. EXACT is case-sensitive.",
      parameters: z.object({
        text1: z.string().describe("The first text string."),
        text2: z.string().describe("The second text string."),
      }),
      execute: async ({ text1, text2 }) => {
        return formulajs.EXACT(text1, text2);
      },
    }),
    FIND: tool({
      description:
        "Finds one text string (within_text) within another text string (text), and returns the number of the starting position of within_text from the first character of text.",
      parameters: z.object({
        find_text: z.string().describe("The text you want to find."),
        within_text: z
          .string()
          .describe("The text containing the text you want to find."),
        start_num: z
          .number()
          .optional()
          .describe(
            "Specifies the character at which to start the search. The first character in text is character number 1. If you omit start_num, it is assumed to be 1.",
          ),
      }),
      execute: async ({ find_text, within_text, start_num }) => {
        return formulajs.FIND(find_text, within_text, start_num);
      },
    }),
    LEFT: tool({
      description:
        "Returns the first character or characters in a text string, based on the number of characters you specify.",
      parameters: z.object({
        text: z
          .string()
          .describe("The text string that contains the characters you want to extract."),
        num_chars: z
          .number()
          .describe(
            "Specifies how many characters you want LEFT to extract. Must be greater than or equal to zero. If num_chars is greater than the length of text, LEFT returns all of text.",
          ),
      }),
      execute: async ({ text, num_chars }) => {
        return formulajs.LEFT(text, num_chars);
      },
    }),
    LEN: tool({
      description: "Returns the number of characters in a text string.",
      parameters: z.object({
        text: z
          .string()
          .describe(
            "The text whose length you want to find. Spaces count as characters.",
          ),
      }),
      execute: async ({ text }) => {
        return formulajs.LEN(text);
      },
    }),
    LOWER: tool({
      description: "Converts all uppercase letters in a text string to lowercase.",
      parameters: z.object({
        text: z.string().describe("The text you want to convert to lowercase."),
      }),
      execute: async ({ text }) => {
        return formulajs.LOWER(text);
      },
    }),
    MID: tool({
      description:
        "Returns a number of characters from a text string, starting at the position you specify, based on the number of characters you specify.",
      parameters: z.object({
        text: z
          .string()
          .describe("The text string containing the characters you want to extract."),
        start_num: z
          .number()
          .describe(
            "The position of the first character that you want to extract in text. The first character in text has start_num 1.",
          ),
        num_chars: z
          .number()
          .describe("Specifies how many characters to return from text."),
      }),
      execute: async ({ text, start_num, num_chars }) => {
        return formulajs.MID(text, start_num, num_chars);
      },
    }),
    NUMBERVALUE: tool({
      description: "Converts text to number in a locale-independent way.",
      parameters: z.object({
        text: z.string().describe("The text to convert to number."),
        decimal_separator: z
          .string()
          .describe(
            "The character used to separate the integer and fractional part of the number.",
          ),
        group_separator: z
          .string()
          .describe(
            "The character used to separate groupings of digits, such as thousands and hundreds.",
          ),
      }),
      execute: async ({ text, decimal_separator, group_separator }) => {
        return formulajs.NUMBERVALUE(text, decimal_separator, group_separator);
      },
    }),
    PROPER: tool({
      description: "Capitalizes the first letter in each word of a text string.",
      parameters: z.object({
        text: z
          .string()
          .describe("Text enclosed in double quotation marks and empty text('')."),
      }),
      execute: async ({ text }) => {
        return formulajs.PROPER(text);
      },
    }),

    REPLACE: tool({
      description:
        "Replaces part of a text string, based on the number of characters you specify, with a different text string.",
      parameters: z.object({
        old_text: z
          .string()
          .describe("Text in which you want to replace some characters."),
        start_num: z
          .number()
          .describe(
            "The position of the character in old_text that you want to replace with new_text.",
          ),
        num_chars: z
          .number()
          .describe(
            "The number of characters in old_text that you want REPLACE to replace with new_text.",
          ),
        new_text: z
          .string()
          .describe("The text that will replace characters in old_text."),
      }),
      execute: async ({ old_text, start_num, num_chars, new_text }) => {
        return formulajs.REPLACE(old_text, start_num, num_chars, new_text);
      },
    }),
    REPT: tool({
      description:
        "Repeats text a given number of times. Use REPT to fill a cell with a number of instances of a text string.",
      parameters: z.object({
        text: z.string().describe("The text you want to repeat."),
        number_times: z
          .number()
          .describe("A positive number specifying the number of times to repeat text."),
      }),
      execute: async ({ text, number_times }) => {
        return formulajs.REPT(text, number_times);
      },
    }),
    RIGHT: tool({
      description:
        "Returns the last character or characters in a text string, based on the number of characters you specify.",
      parameters: z.object({
        text: z
          .string()
          .describe("The text string containing the characters you want to extract."),
        num_chars: z
          .number()
          .describe("Specifies how many characters you want RIGHT to extract."),
      }),
      execute: async ({ text, num_chars }) => {
        return formulajs.RIGHT(text, num_chars);
      },
    }),
    ROMAN: tool({
      description: "Converts an Arabic numeral to Roman, as text.",
      parameters: z.object({
        number: z
          .number()
          .describe(
            "The Arabic numeral you want to convert. Must be a positive integer between 1 and 3999, inclusive.",
          ),
      }),
      execute: async ({ number }) => {
        return formulajs.ROMAN(number);
      },
    }),
    SEARCH: tool({
      description:
        "Finds one text string (find_text) within another text string (within_text), and returns the number of the starting position of find_text.",
      parameters: z.object({
        find_text: z.string().describe("The text you want to find."),
        within_text: z
          .string()
          .describe("The text in which you want to search for find_text."),
        start_num: z
          .number()
          .optional()
          .describe(
            "The character number in within_text at which you want to start searching.If start_num is omitted, it is assumed to be 1.",
          ),
      }),
      execute: async ({ find_text, within_text, start_num }) => {
        return formulajs.SEARCH(find_text, within_text, start_num);
      },
    }),

    SUBSTITUTE: tool({
      description: "Substitutes new_text for old_text in a text string.",
      parameters: z.object({
        text: z
          .string()
          .describe(
            "The text or the reference to a cell containing text for which you want to substitute characters.",
          ),
        old_text: z.string().describe("The text you want to replace."),
        new_text: z
          .string()
          .describe("The text with which you want to replace old_text."),
        instance_num: z
          .number()
          .optional()
          .describe(
            "Specifies which occurrence of old_text you want to replace with new_text. If you specify instance_num, only that instance of old_text is replaced. Otherwise, every occurrence of old_text in text is changed to new_text.",
          ),
      }),
      execute: async ({ text, old_text, new_text, instance_num }) => {
        return formulajs.SUBSTITUTE(text, old_text, new_text, instance_num);
      },
    }),
    T: tool({
      description: "Returns the text pointed to by value.",
      parameters: z.object({
        value: z
          .string()
          .describe(
            "The value to be tested. T returns value if value is text or if value refers to a cell containing text. If value does not contain text, T returns empty text.",
          ),
      }),
      execute: async ({ value }) => {
        return formulajs.T(value);
      },
    }),
    TRIM: tool({
      description: "Removes all spaces from text except for single spaces between words.",
      parameters: z.object({
        text: z.string().describe("The text from which you want to remove spaces."),
      }),
      execute: async ({ text }) => {
        return formulajs.TRIM(text);
      },
    }),
    TEXTJOIN: tool({
      description:
        "Combines the text from multiple ranges and/or strings, and includes a delimiter you specify between each text value.",
      parameters: z.object({
        delimiter: z
          .string()
          .describe(
            "A text string, empty, or one or more characters enclosed in double quotes or a reference to a valid text string. If supplied, the delimiter is added between each of the text strings that are joined.",
          ),
        ignore_empty: z
          .boolean()
          .describe(
            "If TRUE, ignores empty cells. If FALSE, empty cells are included in the concatenation.",
          ),
        text: z.array(z.string()).describe("Text items to be joined together."),
      }),
      execute: async ({ delimiter, ignore_empty, text }) => {
        return formulajs.TEXTJOIN(delimiter, ignore_empty, ...text);
      },
    }),
    UNICHAR: tool({
      description:
        "Returns the Unicode character that is referenced by the given numeric value.",
      parameters: z.object({
        number: z.number().describe("A number between 1 and 109999."),
      }),
      execute: async ({ number }) => {
        return formulajs.UNICHAR(number);
      },
    }),
    UNICODE: tool({
      description: "Returns the number corresponding to the first character in the text.",
      parameters: z.object({
        text: z
          .string()
          .describe("Text for which you want the Unicode value of the first character."),
      }),
      execute: async ({ text }) => {
        return formulajs.UNICODE(text);
      },
    }),
    UPPER: tool({
      description: "Converts text to uppercase.",
      parameters: z.object({
        text: z.string().describe("The text you want to convert to uppercase."),
      }),
      execute: async ({ text }) => {
        return formulajs.UPPER(text);
      },
    }),
  };

  for (const toolName in tools) {
    if (config?.excludeTools?.includes(toolName as ExcelFunctionTools)) {
      delete tools[toolName as ExcelFunctionTools];
    }
  }

  return tools;
};

export { excelFunctionTools as formulaTools };
