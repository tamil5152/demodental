import { describe, expect, it } from "vitest";
import { addDays, bookingSchema, normalizePhone, slotsForDate, weekdayOf } from "../booking";
import { bookingMessage, waLink } from "../whatsapp";

// Wednesday 2026-12-02 10:00 in Asia/Kolkata (= 04:30 UTC)
const NOW = new Date("2026-12-02T04:30:00Z");

describe("normalizePhone", () => {
  it("adds the default country code to 10 digit numbers", () => {
    expect(normalizePhone("98765 43210")).toBe("919876543210");
  });
  it("keeps international numbers and strips formatting", () => {
    expect(normalizePhone("+91 (98765) 43210")).toBe("919876543210");
    expect(normalizePhone("0044 7911 123456")).toBe("447911123456");
  });
  it("rejects junk", () => {
    expect(normalizePhone("12345")).toBeNull();
    expect(normalizePhone("abc")).toBeNull();
  });
});

describe("slotsForDate", () => {
  it("returns no slots on Sunday", () => {
    expect(weekdayOf("2026-12-06")).toBe(0);
    expect(slotsForDate("2026-12-06", NOW)).toEqual([]);
  });
  it("skips lunch break and respects closing time", () => {
    const slots = slotsForDate("2026-12-03", NOW); // Thursday
    expect(slots[0]).toBe("09:00");
    expect(slots).not.toContain("13:00");
    expect(slots).not.toContain("13:30");
    expect(slots).toContain("14:00");
    expect(slots.at(-1)).toBe("18:30");
  });
  it("closes earlier on Saturday", () => {
    expect(slotsForDate("2026-12-05", NOW).at(-1)).toBe("14:30");
  });
  it("needs 60 minutes' notice for same-day slots", () => {
    const slots = slotsForDate("2026-12-02", NOW); // now is 10:00
    expect(slots[0]).toBe("11:00");
  });
  it("rejects past dates and dates beyond the booking window", () => {
    expect(slotsForDate("2026-12-01", NOW)).toEqual([]);
    expect(slotsForDate(addDays("2026-12-02", 60), NOW)).toEqual([]);
  });
});

describe("bookingSchema", () => {
  const valid = {
    name: "Asha Kumar",
    phone: "9876543210",
    service: "teeth-whitening",
    date: "2026-12-03",
    time: "10:00",
  };
  it("accepts a valid booking", () => {
    expect(bookingSchema.safeParse(valid).success).toBe(true);
  });
  it("rejects unknown services and a filled honeypot", () => {
    expect(bookingSchema.safeParse({ ...valid, service: "hair-cut" }).success).toBe(false);
    expect(bookingSchema.safeParse({ ...valid, website: "http://spam" }).success).toBe(false);
  });
});

describe("whatsapp helpers", () => {
  it("builds an encoded wa.me link", () => {
    expect(waLink("hi there")).toContain("?text=hi%20there");
  });
  it("includes the reference and treatment in the booking message", () => {
    const msg = bookingMessage({ reference: "BR-ABCDE", name: "Asha", service: "teeth-whitening", date: "2026-12-03", time: "10:00" });
    expect(msg).toContain("BR-ABCDE");
    expect(msg).toContain("Teeth Whitening");
    expect(msg).toContain("10:00 am");
  });
});
